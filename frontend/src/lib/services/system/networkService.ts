import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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
