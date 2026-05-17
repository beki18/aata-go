import { useState, useMemo } from 'react';
import { Search, Bus, MapPin, ChevronRight, X } from 'lucide-react';

export default function RouteSelection({ routes, onSelectRoute, loading }) {
  const [search, setSearch] = useState('');

  const filteredRoutes = useMemo(() => {
    if (!search.trim()) return routes;
    const q = search.toLowerCase();
    return routes.filter(
      (r) =>
        r.routeName?.toLowerCase().includes(q) ||
        r.groupId?.toLowerCase().includes(q)
    );
  }, [routes, search]);

  const activeRoutes = filteredRoutes.filter(
    (r) => r.busCount && r.busCount > 0
  );

  return (
    <div className="h-full flex flex-col bg-navy-900">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center">
            <Bus className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">AATA Go</h1>
            <p className="text-xs text-accent-cyan font-medium">የአውቶቢስ መከታተያ</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes... / መንገድ ፈልግ..."
            className="w-full pl-11 pr-10 py-3.5 bg-navy-800 border border-navy-600 rounded-2xl text-text-primary placeholder-text-secondary/50 text-sm focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-3">
        <p className="text-xs text-text-secondary">
          {routes.length} routes / {routes.length} መንገዶች
        </p>
      </div>

      {/* Route list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-text-primary font-medium mb-1">No routes found</p>
            <p className="text-text-secondary text-sm">ምንም መንገድ አልተገኘም</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRoutes.map((route, index) => (
              <button
                key={route.groupId}
                onClick={() => onSelectRoute(route)}
                className={`animate-fade-in w-full text-left p-5 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                  route.busCount > 0
                    ? 'bg-navy-800 border border-navy-600 hover:border-accent-cyan/30 hover:bg-navy-700'
                    : 'bg-navy-800 border border-navy-600 hover:border-accent-cyan/30 hover:bg-navy-700'
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-text-primary truncate">
                        {route.routeName || 'Unnamed Route'}
                      </h3>
                      {route.busCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-green/10 rounded-full shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                          <span className="text-accent-green text-xs font-medium">
                            {route.busCount}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Station info */}
                    <div className="flex items-center gap-1 text-text-secondary text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {route.station1Name || 'Station 1'}
                      </span>
                      {route.station2_lat != null && route.station2_lng != null ? (
                        <>
                          <span className="mx-1 text-text-secondary/40">→</span>
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {route.station2Name || 'Station 2'}
                          </span>
                        </>
                      ) : (
                        <span className="ml-2 text-accent-amber/60 text-xs">(single station)</span>
                      )}
                    </div>

                    {route.busCount === 0 && (
                      <p className="text-accent-amber/70 text-xs">
                        No buses active now - view route map / አሁን አውቶቢስ የለም - መንገዱን ይመልከቱ
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-text-secondary/50 mt-1 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
