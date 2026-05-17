import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';

export function useRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const routesRef = ref(db, 'groups');

    const handler = onValue(
      routesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setRoutes([]);
          setLoading(false);
          return;
        }

        const parsed = Object.entries(data).map(([groupId, group]) => {
          const buses = group.buses || {};
          const busEntries = Object.entries(buses);
          const busCount = busEntries.length;

          // Extract station names if available (use coordinates as fallback)
          const station1Name = group.station1_name || '';
          const station2Name = group.station2_name || '';

          return {
            groupId,
            routeName: group.routeName || '',
            station1Name,
            station2Name,
            station_lat: group.station_lat,
            station_lng: group.station_lng,
            station2_lat: group.station2_lat,
            station2_lng: group.station2_lng,
            radius: group.radius,
            busCount,
            busData: buses,
          };
        });

        setRoutes(parsed);
        setLoading(false);
      },
      (err) => {
        console.error('Firebase routes error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => off(routesRef, 'value', handler);
  }, []);

  return { routes, loading, error };
}

export function useBusGPS(route) {
  const [busPositions, setBusPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!route?.busData) {
      setBusPositions([]);
      return;
    }

    setLoading(true);
    const buses = route.busData;
    const trackerIds = [];

    // Collect all tracker IDs
    Object.entries(buses).forEach(([plate, busInfo]) => {
      if (busInfo._trackerId) {
        trackerIds.push({
          plate,
          trackerId: busInfo._trackerId,
          phone: busInfo.phone,
        });
      }
    });

    if (trackerIds.length === 0) {
      setBusPositions([]);
      setLoading(false);
      return;
    }

    // Set up real-time listeners for each tracker
    const listeners = trackerIds.map(({ plate, trackerId, phone }) => {
      const gpsRef = ref(db, trackerId);
      
      const handler = onValue(
        gpsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data && data.latitude && data.longitude) {
            setBusPositions((prev) => {
              const filtered = prev.filter((b) => b.plate !== plate);
              return [
                ...filtered,
                {
                  plate,
                  trackerId,
                  phone,
                  lat: data.latitude,
                  lng: data.longitude,
                  lastUpdate: data.timestamp || data.lastUpdate || Date.now(),
                  speed: data.speed || 0,
                },
              ];
            });
          } else {
            // Remove bus if no data
            setBusPositions((prev) => prev.filter((b) => b.plate !== plate));
          }
          setLoading(false);
        },
        (err) => {
          console.error(`GPS error for ${trackerId}:`, err);
          setLoading(false);
        }
      );

      return { ref: gpsRef, handler };
    });

    return () => {
      listeners.forEach(({ ref: r, handler: h }) => {
        off(r, 'value', h);
      });
    };
  }, [route?.busData, route?.groupId]);

  return { busPositions, loading };
}
