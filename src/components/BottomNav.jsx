import { MapPin, Map, Info } from 'lucide-react';

const tabs = [
  {
    id: 'routes',
    labelEn: 'Routes',
    labelAm: 'መንገዶች',
    icon: MapPin,
  },
  {
    id: 'map',
    labelEn: 'Map',
    labelAm: 'ካርታ',
    icon: Map,
  },
  {
    id: 'about',
    labelEn: 'About',
    labelAm: 'ስለ',
    icon: Info,
  },
];

export default function BottomNav({ activeTab, onTabChange, selectedRoute }) {
  return (
    <nav className="bg-navy-800/95 backdrop-blur-lg border-t border-navy-600 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.id === 'map' && !selectedRoute;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center py-3 px-4 min-w-[72px] transition-all duration-200 ${
                isDisabled
                  ? 'opacity-30 cursor-not-allowed'
                  : isActive
                  ? 'text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium leading-tight">
                {tab.labelEn}
              </span>
              <span className="text-[9px] text-text-secondary leading-tight">
                {tab.labelAm}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-accent-cyan rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
