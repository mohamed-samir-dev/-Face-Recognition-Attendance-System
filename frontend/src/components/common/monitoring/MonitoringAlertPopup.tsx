"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { acknowledgeAlert, MonitoringAlert } from "@/lib/services/system/monitoringService";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { isWithinMultipleGeofences } from "@/lib/utils/geolocation";
import { COMPANY_LOCATIONS } from "@/lib/constants/locations";

interface MonitoringAlertPopupProps {
  employeeId: string;
}

export default function MonitoringAlertPopup({ employeeId }: MonitoringAlertPopupProps) {
  const [alert, setAlert] = useState<MonitoringAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (!employeeId) return;

    const alertsRef = collection(db, "monitoringAlerts");
    const q = query(
      alertsRef,
      where("employeeId", "==", employeeId),
      where("acknowledged", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const alertData = snapshot.docs[0].data() as MonitoringAlert;
        const elapsed = Math.floor((Date.now() - new Date(alertData.timestamp).getTime()) / 1000);
        const remaining = Math.max(0, 120 - elapsed);
        
        if (remaining > 0) {
          setAlert(alertData);
          setIsVisible(true);
          setTimeLeft(remaining);
        }
      }
    });

    return () => unsubscribe();
  }, [employeeId]);

  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          setAlert(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  const handleAcknowledge = async () => {
    if (alert) {
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });

          // Check all locations and get nearest
          const { isWithin, allDistances } = isWithinMultipleGeofences(
            position.coords.latitude,
            position.coords.longitude,
            COMPANY_LOCATIONS
          );

          // Try to get human-readable address (optional, for display only)
          let address = "";
          try {
            const osmResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18`,
              { headers: { 'User-Agent': 'IntelliAttend/1.0' } }
            );
            const osmData = await osmResponse.json();
            address = osmData.display_name || "";
          } catch {
            address = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          }

          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            address,
            isWithinGeofence: isWithin,
            allDistances: allDistances.map((dist, idx) => {
              const allLocs = [COMPANY_LOCATIONS.mainOffice, ...COMPANY_LOCATIONS.branches];
              return {
                name: allLocs[idx].name,
                distance: dist.distance,
                isWithin: dist.isWithin
              };
            })
          };
        } catch {
          console.log("Location access denied");
        }
      }

      // Get IP address
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch  {
        console.log("Could not fetch IP");
      }

      // Get device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Get network info
      let networkInfo = null;
      if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
        const nav = navigator as Navigator & {
          connection?: { effectiveType?: string; downlink?: number };
          mozConnection?: { effectiveType?: string; downlink?: number };
          webkitConnection?: { effectiveType?: string; downlink?: number };
        };
        const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
        networkInfo = {
          connectionType: conn?.effectiveType || 'unknown',
          downlink: conn?.downlink
        };
      }

      await acknowledgeAlert(alert.id, location || undefined, ipAddress, deviceInfo, networkInfo || undefined);
      setIsVisible(false);
      setAlert(null);
    }
  };

  if (!isVisible || !alert) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 max-w-lg w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="bg-blue-600 rounded-full p-4">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Monitoring Check
            </h2>
            <p className="text-gray-600 text-sm">
              Please confirm your presence
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
            <p className="text-gray-700 leading-relaxed">
              {alert.message}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-2xl font-bold text-orange-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Sent at: {new Date(alert.timestamp).toLocaleTimeString()}
          </p>

          <button
            onClick={handleAcknowledge}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I&rsquo;m Here - Confirm Presence</span>
          </button>

          <p className="text-xs text-gray-400 italic">
            This alert will automatically disappear when timer reaches 0:00
          </p>
        </div>
      </div>
    </div>
  );
}
