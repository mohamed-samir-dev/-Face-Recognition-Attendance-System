interface Location {
  name: string;
  coordinates: { lat: number; lng: number };
  radius: number;
}

interface GeofenceResult {
  distance: number;
  isWithin: boolean;
}

export function isWithinMultipleGeofences(
  lat: number,
  lng: number,
  locations: { mainOffice: Location; branches: Location[] }
): { isWithin: boolean; allDistances: GeofenceResult[] } {
  const allLocations = [locations.mainOffice, ...locations.branches];
  const allDistances: GeofenceResult[] = [];

  let isWithinAny = false;

  for (const location of allLocations) {
    const distance = calculateDistance(
      lat,
      lng,
      location.coordinates.lat,
      location.coordinates.lng
    );
    const isWithin = distance <= location.radius;
    
    allDistances.push({ distance, isWithin });
    
    if (isWithin) {
      isWithinAny = true;
    }
  }

  return { isWithin: isWithinAny, allDistances };
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
