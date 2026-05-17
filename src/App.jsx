import { useState, useEffect, useCallback } from 'react';
import Onboarding from './components/Onboarding';
import RouteSelection from './components/RouteSelection';
import LiveMap from './components/LiveMap';
import AboutScreen from './components/AboutScreen';
import BottomNav from './components/BottomNav';
import { useRoutes, useBusGPS } from './hooks/useFirebase';

const ONBOARDING_KEY = 'aata-go-onboarded';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('routes');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const { routes, loading: routesLoading } = useRoutes();
  const { busPositions, loading: gpsLoading } = useBusGPS(
    activeTab === 'map' ? selectedRoute : null
  );

  // Check onboarding status
  useEffect(() => {
    try {
      const seen = localStorage.getItem(ONBOARDING_KEY);
      if (seen === 'true') {
        setOnboarded(true);
      }
    } catch {
      // localStorage not available, skip onboarding
      setOnboarded(true);
    }
    setCheckingOnboarding(false);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {}
    setOnboarded(true);
  }, []);

  const handleSelectRoute = useCallback((route) => {
    setSelectedRoute(route);
    setActiveTab('map');
  }, []);

  const handleBackFromMap = useCallback(() => {
    setActiveTab('routes');
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Show loading splash while checking onboarding
  if (checkingOnboarding) {
    return (
      <div className="h-full flex items-center justify-center bg-navy-900">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center mx-auto mb-4 animate-float">
            <span className="text-2xl">🚌</span>
          </div>
          <p className="text-text-primary font-semibold">AATA Go</p>
        </div>
      </div>
    );
  }

  // Show onboarding
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main app
  const showMap = activeTab === 'map' && selectedRoute;

  return (
    <div className="h-full flex flex-col relative">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'routes' && (
          <RouteSelection
            routes={routes}
            onSelectRoute={handleSelectRoute}
            loading={routesLoading}
          />
        )}
        {showMap && (
          <LiveMap
            route={selectedRoute}
            busPositions={busPositions}
            onBack={handleBackFromMap}
          />
        )}
        {!showMap && activeTab === 'map' && (
          <div className="h-full flex flex-col items-center justify-center bg-navy-900 px-8">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Select a Route First
              </h2>
              <p className="text-text-secondary text-sm mb-1">
                መጀመሪያ መንገድ ይምረጡ
              </p>
              <p className="text-text-secondary/60 text-xs mt-3">
                Go to Routes tab and tap a route to see live tracking
              </p>
              <p className="text-text-secondary/40 text-xs mt-1">
                ንቁ መከታተያ ለማየት ወደ መንገዶች ትር ይሂዱ
              </p>
            </div>
          </div>
        )}
        {activeTab === 'about' && <AboutScreen />}
      </div>

      {/* Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedRoute={selectedRoute}
      />
    </div>
  );
}
