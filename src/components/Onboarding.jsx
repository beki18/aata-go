import { useState, useEffect, useCallback } from 'react';
import { Bus, MapPin, Navigation, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Rocket,
    titleEn: 'Welcome to AATA Go',
    titleAm: 'እንኳው እንግዳ በደህና መጡ',
    descEn: 'Track your bus in real-time across Addis Ababa',
    descAm: 'በአዲስ አበባ ውስጥ አውቶቢስዎን በእውነት ጊዜ ይከታተሉ',
    gradient: 'from-accent-cyan/20 to-accent-green/20',
    iconBg: 'bg-accent-cyan/20',
    iconColor: 'text-accent-cyan',
  },
  {
    icon: MapPin,
    titleEn: 'Choose Your Route',
    titleAm: 'የአውቶቢስ መንገድዎን ይምረጡ',
    descEn: 'Pick the bus route you want to follow',
    descAm: 'የመከተል አውቶቢስ መንገድ ይምረጡ',
    gradient: 'from-accent-green/20 to-accent-amber/20',
    iconBg: 'bg-accent-green/20',
    iconColor: 'text-accent-green',
  },
  {
    icon: Navigation,
    titleEn: 'Track Buses Live',
    titleAm: 'አውቶቢሶችን በተለመለመ ይከታተሉ',
    descEn: 'See where buses are on the map right now',
    descAm: 'አውቶቢሶችን አሁን ካርታ ላይ ይመልከቱ',
    gradient: 'from-accent-amber/20 to-accent-cyan/20',
    iconBg: 'bg-accent-amber/20',
    iconColor: 'text-accent-amber',
  },
  {
    icon: Bus,
    titleEn: "You're All Set!",
    titleAm: 'ሁሉም ዝግጁ ነዎት!',
    descEn: 'Start tracking your bus now',
    descAm: 'አውቶቢስዎን አሁን ይከታተሉ',
    gradient: 'from-accent-cyan/20 to-accent-green/20',
    iconBg: 'bg-accent-green/20',
    iconColor: 'text-accent-green',
  },
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState('right');

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection('right');
      setCurrentStep(s => s + 1);
    } else {
      onComplete();
    }
  }, [currentStep, onComplete]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection('left');
      setCurrentStep(s => s - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="h-full flex flex-col bg-navy-900">
      {/* Skip button */}
      {!isLast && (
        <div className="flex justify-end p-4 pt-6">
          <button
            onClick={onComplete}
            className="text-text-secondary text-sm font-medium px-4 py-2 rounded-full hover:bg-navy-700 transition-colors"
          >
            Skip
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Animated icon */}
        <div
          key={currentStep}
          className={`animate-fade-in w-32 h-32 rounded-3xl ${step.iconBg} flex items-center justify-center mb-8 animate-float`}
        >
          <Icon className={`w-16 h-16 ${step.iconColor}`} strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div
          key={`text-${currentStep}`}
          className={`animate-fade-in text-center max-w-sm`}
        >
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            {step.titleEn}
          </h1>
          <h2 className="text-xl font-semibold text-accent-cyan mb-4">
            {step.titleAm}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed">
            {step.descEn}
          </p>
          <p className="text-text-secondary/70 text-sm leading-relaxed mt-1">
            {step.descAm}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="pb-12 px-8">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentStep ? 'right' : 'left');
                setCurrentStep(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-accent-cyan'
                  : 'w-2 bg-navy-600 hover:bg-navy-600/80'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={goNext}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-[0.98] ${
            isLast
              ? 'bg-gradient-to-r from-accent-cyan to-accent-green text-navy-900'
              : 'bg-navy-700 text-text-primary hover:bg-navy-600'
          }`}
        >
          {isLast ? 'Get Started / ጀምር' : 'Next →'}
        </button>

        {/* Back button */}
        {currentStep > 0 && (
          <button
            onClick={goPrev}
            className="w-full py-3 text-text-secondary text-sm font-medium mt-3 hover:text-text-primary transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
