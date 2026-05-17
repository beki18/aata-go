import { useState, useEffect, useCallback, useRef } from 'react';
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

          // Extract station names - Command Center doesn't save station names separately
          // Use routeName as the overall route identifier
          const station1Name = group.station1_name || group.routeName || '';
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
  const busDataRef = useRef(null);

  useEffect(() => {
    // Store latest busData in ref to avoid dependency issues
    if (route?.busData) {
      busDataRef.current = route.busData;
    }
  }, [route?.busData]);

  useEffect(() => {
    const buses = busDataRef.current || route?.busData;
    if (!buses) {
      setBusPositions([]);
      return;
    }

    setLoading(true);
    const trackerIds = [];

    // Collect all tracker IDs
    try {
      Object.entries(buses).forEach(([plate, busInfo]) => {
        if (busInfo && busInfo._trackerId) {
          trackerIds.push({
            plate,
            trackerId: busInfo._trackerId,
            phone: busInfo.phone,
          });
        }
      });
    } catch (e) {
      console.error('Error parsing bus data:', e);
      setBusPositions([]);
      setLoading(false);
      return;
    }

    if (trackerIds.length === 0) {
      setBusPositions([]);
      setLoading(false);
      return;
    }

    // Set up real-time listeners for each tracker
    const listeners = trackerIds.map(({ plate, trackerId, phone }) => {
      let gpsRef;
      let handler;
      try {
        gpsRef = ref(db, trackerId);
        
        handler = onValue(
          gpsRef,
          (snapshot) => {
            try {
              const data = snapshot.val();
              if (data && data.latitude != null && data.longitude != null) {
                const lat = parseFloat(data.latitude);
                const lng = parseFloat(data.longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                  setBusPositions((prev) => {
                    const filtered = prev.filter((b) => b.plate !== plate);
                    return [
                      ...filtered,
                      {
                        plate,
                        trackerId,
                        phone,
                        lat,
                        lng,
                        lastUpdate: data.timestamp || data.lastUpdate || Date.now(),
                        speed: data.speed || 0,
                      },
                    ];
                  });
                }
              } else {
                // Remove bus if no data
                setBusPositions((prev) => prev.filter((b) => b.plate !== plate));
              }
            } catch (e) {
              console.error(`Error processing GPS for ${trackerId}:`, e);
            }
            setLoading(false);
          },
          (err) => {
            console.error(`GPS error for ${trackerId}:`, err);
            setLoading(false);
          }
        );
      } catch (e) {
        console.error(`Error setting up listener for ${trackerId}:`, e);
      }

      return { ref: gpsRef, handler };
    });

    return () => {
      listeners.forEach(({ ref: r, handler: h }) => {
        if (r && h) {
          try { off(r, 'value', h); } catch (e) { /* cleanup */ }
        }
      });
    };
  }, [route?.groupId]); // Only depend on groupId, not busData object

  return { busPositions, loading };
}
