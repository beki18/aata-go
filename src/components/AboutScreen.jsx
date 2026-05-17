import { Bus, MapPin, Navigation, Shield, Phone, Info } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    titleEn: 'Open the App',
    titleAm: 'መተግበሪያውን ይክፈቱ',
    descEn: 'Launch AATA Go on your phone or browser',
    descAm: 'AATA Go ን በስልክዎ ወይም ብራውዘር ይክፈቱ',
  },
  {
    icon: Bus,
    titleEn: 'Select Your Route',
    titleAm: 'መንገድዎን ይምረጡ',
    descEn: 'Choose the bus route you want to track',
    descAm: 'የመከታተል አውቶቢስ መንገድ ይምረጡ',
  },
  {
    icon: Navigation,
    titleEn: 'View Live Map',
    titleAm: 'በተለመለመ ካርታ ይመልከቱ',
    descEn: 'See all active buses moving in real-time on the map',
    descAm: 'ካርታ ላይ ንቁ አውቶቢሶችን በእውነት ጊዜ ይመልከቱ',
  },
  {
    icon: Info,
    titleEn: 'Tap a Bus',
    titleAm: 'አውቶቢስ ይጫኑ',
    descEn: 'Tap any bus marker to see plate number and status',
    descAm: 'ፕሌት ቁጥር እና ሁኔታ ለማየት አውቶቢስ ምልክት ይጫኑ',
  },
];

export default function AboutScreen() {
  return (
    <div className="h-full flex flex-col bg-navy-900 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-green flex items-center justify-center">
            <Bus className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">About</h1>
            <p className="text-xs text-accent-cyan font-medium">ስለ መተግበሪያው</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8 space-y-6">
        {/* App description */}
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5">
          <p className="text-text-primary text-sm leading-relaxed">
            AATA Go helps you track public buses in Addis Ababa in real-time.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed mt-2">
            AATA Go በአዲስ አበባ ውስጥ ያሉ የህዝብ አውቶቢሶችን በእውነት ጊዜ ይከታተልልዎታል።
          </p>
        </div>

        {/* How to use */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">
            How to Use / እንዴት ይጠቀማሉ
          </h2>
          <div className="space-y-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-navy-800/50 border border-navy-700 rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-accent-cyan text-xs font-bold">0{i + 1}</span>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {step.titleEn}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-accent-cyan/70 mb-1">
                      {step.titleAm}
                    </p>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {step.descEn}
                    </p>
                    <p className="text-text-secondary/60 text-xs leading-relaxed mt-0.5">
                      {step.descAm}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">
            Features / ባህሪያት
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Navigation,
                labelEn: 'Live GPS',
                labelAm: 'በተለመለመ GPS',
              },
              {
                icon: MapPin,
                labelEn: 'Route Map',
                labelAm: 'መንገድ ካርታ',
              },
              {
                icon: Bus,
                labelEn: 'Bus Status',
                labelAm: 'የአውቶቢስ ሁኔታ',
              },
              {
                icon: Phone,
                labelEn: 'Bilingual',
                labelAm: 'በሁለት ቋንቋ',
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-navy-800 border border-navy-600 rounded-2xl p-4 flex flex-col items-center text-center gap-2"
                >
                  <Icon className="w-6 h-6 text-accent-cyan" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {f.labelEn}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {f.labelAm}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-navy-800/30 border border-navy-700 rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-accent-cyan" />
            <p className="text-sm font-medium text-text-primary">
              Powered by AATA Command Center
            </p>
          </div>
          <p className="text-xs text-text-secondary">
            Version 1.0.0
          </p>
          <p className="text-[10px] text-text-secondary/50 mt-1">
            Addis Ababa Transport Authority
          </p>
        </div>
      </div>
    </div>
  );
}
