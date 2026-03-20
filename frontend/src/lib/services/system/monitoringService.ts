export interface MonitoringAlert {
  id: string;
  employeeId: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  message?: string;
  location?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    isWithinGeofence?: boolean;
    allDistances?: Array<{ distance: number; isWithin: boolean; name: string }>;
  };
  geofenceStatus?: string;
  mainOffice?: string;
  branchOffice?: string;
  ipAddress?: string;
  userAgent?: string;
  screenResolution?: string;
  timezone?: string;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    screenResolution?: string;
    timezone?: string;
  };
}

export async function getAllMonitoringAlerts(): Promise<MonitoringAlert[]> {
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase/config');
  
  const alertsRef = collection(db, 'monitoringAlerts');
  const q = query(alertsRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as MonitoringAlert);
}

export async function acknowledgeAlert(
  alertId: string,
  location?: MonitoringAlert['location'],
  ipAddress?: string | null,
  deviceInfo?: MonitoringAlert['deviceInfo'],
  networkInfo?: Record<string, unknown>
): Promise<void> {
  const { doc, updateDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase/config');
  
  const alertRef = doc(db, 'monitoringAlerts', alertId);
  await updateDoc(alertRef, {
    acknowledged: true,
    acknowledgedAt: new Date().toISOString(),
    location: location || null,
    ipAddress: ipAddress || null,
    deviceInfo: deviceInfo || null,
    networkInfo: networkInfo || null
  });
}

export async function sendMonitoringAlert(employeeId: string): Promise<void> {
  console.log('[MonitoringAlert] Sending alert to employee:', employeeId);
  
  const { doc, setDoc } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase/config');
  
  const timestamp = new Date().toISOString();
  const alertId = `alert_${employeeId}_${Date.now()}`;
  const message = 'Admin is requesting your attention. Please confirm your presence.';
  
  const alertRef = doc(db, 'monitoringAlerts', alertId);
  await setDoc(alertRef, {
    id: alertId,
    employeeId,
    message,
    timestamp,
    acknowledged: false
  });
  console.log('[MonitoringAlert] Alert saved to monitoringAlerts collection:', alertId);

  try {
    const { createNotification } = await import('./notificationService');
    await createNotification(employeeId, message, 'attendance_reminder');
    console.log('[MonitoringAlert] Notification also created in notifications collection');
  } catch (err) {
    console.error('[MonitoringAlert] Failed to create notification:', err);
  }
}
