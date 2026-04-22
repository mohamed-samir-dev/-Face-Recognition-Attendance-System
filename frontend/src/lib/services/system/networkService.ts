import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface AllowedNetwork {
  id: string;
  ip: string;
  label: string;
  addedAt: string;
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
  });
}

export async function removeAllowedNetwork(id: string): Promise<void> {
  await deleteDoc(doc(db, "allowedNetworks", id));
}

export async function validateNetworkAccess(): Promise<{
  allowed: boolean;
  currentIp: string | null;
}> {
  try {
    // Get current public IP
    const res = await fetch("https://api.ipify.org?format=json");
    const { ip: currentIp } = await res.json();

    // Get allowed list
    const networks = await getAllowedNetworks();

    // If no networks configured, allow all (so system doesn't lock everyone out)
    if (networks.length === 0) return { allowed: true, currentIp };

    const allowed = networks.some((n) => n.ip === currentIp);
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
