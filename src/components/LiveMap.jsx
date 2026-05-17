import { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  ArrowLeft,
  Bus,
  Clock,
  Navigation,
  Crosshair,
} from 'lucide-react';

const AA_CENTER = [9.025, 38.7469];
const AA_ZOOM = 13;
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Custom marker icons
function createBusIcon(isMoving) {
  const color = isMoving ? '#00e676' : '#ffc107';
  const size = 36;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="${color}"/>
    <text x="${size/2}" y="${size/2 + 1}" text-anchor="middle" dominant-baseline="middle" fill="#0a0e1a" font-size="14" font-weight="bold" font-family="Inter,sans-serif">🚌</text>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'bus-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function createStationIcon(color) {
  const size = 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect x="2" y="2" width="${size-4}" height="${size-4}" rx="6" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="1.5" transform="rotate(45 ${size/2} ${size/2})"/>
    <rect x="6" y="6" width="${size-12}" height="${size-12}" rx="3" fill="${color}" transform="rotate(45 ${size/2} ${size/2})"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'station-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function createUserIcon() {
  const size = 20;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#4285f4" stroke="white" stroke-width="3"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'user-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ markers }) {
  const map = useMap();
  const hasFitted = useRef(false);

  useEffect(() => {
    if (markers.length > 0 && !hasFitted.current) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      hasFitted.current = true;
    }
  }, [markers, map]);

  return null;
}

export default function LiveMap({ route, busPositions, onBack }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocationError(false);
      },
      () => setLocationError(true),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const busMarkers = useMemo(() => {
    return busPositions
      .filter((b) => b.lat && b.lng)
      .map((b) => ({
        lat: parseFloat(b.lat),
        lng: parseFloat(b.lng),
        ...b,
      }));
  }, [busPositions]);

  const stationMarkers = useMemo(() => {
    const markers = [];
    if (route?.station_lat && route?.station_lng) {
      markers.push({
        lat: parseFloat(route.station_lat),
        lng: parseFloat(route.station_lng),
        name: route.station1Name || 'Station 1',
        type: 'station1',
      });
    }
    if (route?.station2_lat && route?.station2_lng) {
      markers.push({
        lat: parseFloat(route.station2_lat),
        lng: parseFloat(route.station2_lng),
        name: route.station2Name || 'Station 2',
        type: 'station2',
      });
    }
    return markers;
  }, [route]);

  const routeLine = useMemo(() => {
    if (stationMarkers.length === 2) {
      return stationMarkers.map((s) => [s.lat, s.lng]);
    }
    return null;
  }, [stationMarkers]);

  const activeBusCount = busMarkers.length;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(Number(timestamp) || timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="h-full flex flex-col bg-navy-900 relative" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '300px' }}>
        <MapContainer
          center={AA_CENTER}
          zoom={AA_ZOOM}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={true}
        >
          <TileLayer url={DARK_TILES} attribution={DARK_ATTRIBUTION} />

          {/* Route line */}
          {routeLine && (
            <Polyline
              positions={routeLine}
              pathOptions={{
                color: '#00bcd4',
                weight: 3,
                opacity: 0.6,
                dashArray: '10, 8',
              }}
            />
          )}

          {/* Stations */}
          {stationMarkers.map((s, i) => (
            <Marker
              key={`station-${i}`}
              position={[s.lat, s.lng]}
              icon={createStationIcon('#00bcd4')}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">{s.name}</p>
                  <p className="text-text-secondary text-xs mt-1">
                    {s.type === 'station1' ? 'Start Station' : 'End Station'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Buses */}
          {busMarkers.map((bus, i) => (
            <Marker
              key={`bus-${i}`}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(true)}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Bus className="w-4 h-4 text-accent-green" />
                    <span className="font-semibold text-text-primary text-sm">
                      {bus.plate || `Bus ${i + 1}`}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3 h-3" />
                      <span>
                        {bus.lat?.toFixed(5)}, {bus.lng?.toFixed(5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        Updated: {formatTime(bus.lastUpdate)}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* User location */}
          {userLocation && (
            <>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy || 50}
                pathOptions={{
                  color: '#4285f4',
                  fillColor: '#4285f4',
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={createUserIcon()}
              />
            </>
          )}

          <FitBounds
            markers={[
              ...stationMarkers,
              ...busMarkers,
              ...(userLocation ? [userLocation] : []),
            ]}
          />
        </MapContainer>

        {/* Floating header */}
        <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={onBack}
              className="w-11 h-11 bg-navy-800/90 backdrop-blur-md border border-navy-600 rounded-xl flex items-center justify-center text-text-primary hover:bg-navy-700 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Route name */}
            <div className="flex-1 bg-navy-800/90 backdrop-blur-md border border-navy-600 rounded-xl px-4 py-2.5 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {route?.routeName || 'Route'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute top-20 left-4 z-[1000] pointer-events-none">
          <div className="pointer-events-auto bg-navy-800/90 backdrop-blur-md border border-navy-600 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs text-text-primary font-medium">
              {activeBusCount} buses active
            </span>
          </div>
        </div>

        {/* Location error toast */}
        {locationError && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <div className="bg-navy-800/90 backdrop-blur-md border border-accent-amber/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-accent-amber" />
              <span className="text-xs text-accent-amber">
                Location unavailable / አቅም ማግኘት አልተቻለም
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
