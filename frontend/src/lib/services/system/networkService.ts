import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface AllowedNetwork {
  id: string;
  ip: string;
  label: string;
  addedAt: string;
  enabled: boolean;
}

export async function getAllowedNetworks(): Promise<AllowedNetwork[]> {
  const snapshot = await getDocs(collection(db, "allowedNetworks"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AllowedNetwork));
}

export async function addAllowedNetwork(ip: string, label: string): Promise<void> {
  const id = `network_${Date.now()}`;
  await setDoc(doc(db, "allowedNetworks", id), {
    id,
    ip: ip.trim(),
    label: label.trim(),
    addedAt: new Date().toISOString(),
    enabled: true,
  });
}

export async function removeAllowedNetwork(id: string): Promise<void> {
  await deleteDoc(doc(db, "allowedNetworks", id));
}

export async function toggleNetworkEnabled(id: string, enabled: boolean): Promise<void> {
  await updateDoc(doc(db, "allowedNetworks", id), { enabled });
}

export async function validateNetworkAccess(role?: string): Promise<{
  allowed: boolean;
  currentIp: string | null;
}> {
  try {
    // Get current public IP
    const res = await fetch("https://api.ipify.org?format=json");
    const { ip: currentIp } = await res.json();

    // Admins are exempt from IP restriction
    if (role === "Admin") return { allowed: true, currentIp };

    // Get allowed list
    const networks = await getAllowedNetworks();

    // If no networks configured, allow all (so system doesn't lock everyone out)
    if (networks.length === 0) return { allowed: true, currentIp };

    const enabledNetworks = networks.filter((n) => n.enabled !== false);

    // If no enabled networks, allow all
    if (enabledNetworks.length === 0) return { allowed: true, currentIp };

    const allowed = enabledNetworks.some((n) => n.ip === currentIp);
    return { allowed, currentIp };
  } catch {
    // If we can't determine IP, allow access to avoid lockout
    return { allowed: true, currentIp: null };
  }
}

export async function logNetworkDenied({
  userId,
  name,
  ip,
  loginMethod,
}: {
  userId: string;
  name: string;
  ip: string | null;
  loginMethod: "password" | "face";
}): Promise<void> {
  try {
    await addDoc(collection(db, "networkDeniedLogs"), {
      userId,
      name,
      ip,
      loginMethod,
      timestamp: serverTimestamp(),
      reviewed: false,
    });
  } catch (e) {
    console.error("Failed to log network denied:", e);
  }
}

/**
 * Called when a user tries to login from a non-allowed IP.
 *
 * Rules:
 * - Flags reset automatically if the current week (Mon–Sun) is different
 *   from the week the first flag was recorded (ipFlagWeekStart).
 * - 1st flag in the week → warning only (ipFlagCount = 1)
 * - 2nd flag in the week → account suspended (status = "Suspended", ipLocked = true)
 * - While suspended every login attempt is blocked with a "contact Admin" message.
 */
export async function checkAndHandleIpFlag(
  userId: string,
  ip: string | null,
  loginMethod: "password" | "face"
): Promise<{ flagCount: number; locked: boolean }> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return { flagCount: 0, locked: false };

    const data = snap.data();

    // ── Week reset logic ──
    const getMondayMs = (d: Date) => {
      const day = d.getDay(); // 0 = Sun
      const diff = (day === 0 ? -6 : 1 - day);
      const monday = new Date(d);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(d.getDate() + diff);
      return monday.getTime();
    };

    const nowMonday = getMondayMs(new Date());
    const storedWeekStart: number = data.ipFlagWeekStart ?? 0;
    const isNewWeek = storedWeekStart < nowMonday;

    const currentFlags: number = isNewWeek ? 0 : (data.ipFlagCount ?? 0);
    const newFlagCount = currentFlags + 1;
    const willSuspend = newFlagCount >= 2;

    await updateDoc(userRef, {
      ipFlagCount: newFlagCount,
      ipFlagWeekStart: isNewWeek ? nowMonday : storedWeekStart,
      ...(willSuspend ? { ipLocked: true, status: "Suspended" } : {}),
    });

    await addDoc(collection(db, "ipFlagLogs"), {
      userId,
      name: data.name || "Unknown",
      image: data.image || null,
      department: data.department || null,
      ip,
      loginMethod,
      flagCount: newFlagCount,
      locked: willSuspend,
      timestamp: serverTimestamp(),
      resolved: false,
    });

    return { flagCount: newFlagCount, locked: willSuspend };
  } catch (e) {
    console.error("checkAndHandleIpFlag error:", e);
    return { flagCount: 0, locked: false };
  }
}

/**
 * Checks if a suspended user's week has passed and auto-resets their flags.
 * Returns true if the account was auto-reset (user can now proceed to login).
 */
export async function checkWeeklyFlagReset(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;

    const data = snap.data();
    if (!data.ipLocked) return false;

    const getMondayMs = (d: Date) => {
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1 - day);
      const monday = new Date(d);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(d.getDate() + diff);
      return monday.getTime();
    };

    const nowMonday = getMondayMs(new Date());
    const storedWeekStart: number = data.ipFlagWeekStart ?? 0;

    if (storedWeekStart < nowMonday) {
      await updateDoc(userRef, {
        ipFlagCount: 0,
        ipLocked: false,
        ipFlagWeekStart: nowMonday,
        status: "Active",
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Admin manually unlocks a user's IP flag suspension */
export async function unlockIpFlag(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { ipFlagCount: 0, ipLocked: false, status: "Active", ipFlagWeekStart: 0 });

  const logsSnap = await getDocs(collection(db, "ipFlagLogs"));
  const batch: Promise<void>[] = logsSnap.docs
    .filter((d) => d.data().userId === userId && !d.data().resolved)
    .map((d) => updateDoc(doc(db, "ipFlagLogs", d.id), { resolved: true }));
  await Promise.all(batch);
}
