import { COMPANY_LOCATIONS } from '@/lib/constants/locations';

export interface LocationData {
  address?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  isWithinGeofence?: boolean;
  allDistances?: Array<{ distance: number; isWithin: boolean; name: string }>;
}

export interface DeviceData {
  userAgent?: string;
  platform?: string;
  screenResolution?: string;
  timezone?: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getLocationData(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const locations = [
          { ...COMPANY_LOCATIONS.mainOffice, lat: COMPANY_LOCATIONS.mainOffice.coordinates.lat, lng: COMPANY_LOCATIONS.mainOffice.coordinates.lng },
          ...COMPANY_LOCATIONS.branches.map(b => ({ ...b, lat: b.coordinates.lat, lng: b.coordinates.lng }))
        ];
        
        const allDistances = locations.map(loc => {
          const distance = calculateDistance(latitude, longitude, loc.lat, loc.lng);
          return {
            name: loc.name,
            distance,
            isWithin: distance <= loc.radius
          };
        });

        const isWithinGeofence = allDistances.some(d => d.isWithin);

        let address = '';
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          address = data.display_name || '';
        } catch {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        resolve({
          address,
          latitude,
          longitude,
          accuracy,
          isWithinGeofence,
          allDistances
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export function getDeviceData(): DeviceData {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

export async function getIPAddress(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}
