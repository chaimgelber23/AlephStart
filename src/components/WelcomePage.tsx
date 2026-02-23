'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ScrollText, Sparkles, Star } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import type { LearningGoal, HebrewLevel, Nusach } from '@/types';

const STEPS = ['welcome', 'goal', 'level', 'community', 'commitment'] as const;
type Step = (typeof STEPS)[number];

export function WelcomePage() {
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState<LearningGoal>('daven');
  const [level, setLevel] = useState<HebrewLevel>('none');
  const [nusach, setNusach] = useState<Nusach>('ashkenaz');
  const [dailyMinutes, setDailyMinutes] = useState(5);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(goal, level, nusach, dailyMinutes);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <OnboardingCard key="welcome" onNext={nextStep}>
            <div className="text-center space-y-6">
              {/* Hebrew Aleph as logo */}
              <div className="font-[var(--font-hebrew-serif)] text-8xl text-primary leading-none text-center">
                א
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Welcome to AlephStart
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Learn to read Hebrew. Learn to daven.
                <br />
                At your own pace, with warmth and encouragement.
              </p>
              <button
                onClick={nextStep}
                className="bg-primary text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] transition-colors"
              >
                Get Started
              </button>
              <p className="text-xs text-gray-400">No account needed. Start learning in 60 seconds.</p>
            </div>
          </OnboardingCard>
        )}

        {step === 'goal' && (
          <OnboardingCard key="goal" onNext={nextStep}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-primary/80 font-medium uppercase tracking-wider mb-2">
                  Step 1 of 4
                </p>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  What brings you to Hebrew?
                </h2>
              </div>
              <div className="space-y-3">
                {([
                  { value: 'daven' as const, label: 'I want to daven (pray) on my own', icon: <BookOpen className="w-6 h-6 text-primary" strokeWidth={1.5} /> },
                  { value: 'learn' as const, label: 'I want to learn Torah', icon: <ScrollText className="w-6 h-6 text-primary" strokeWidth={1.5} /> },
                  { value: 'explore' as const, label: "I'm exploring Judaism", icon: <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} /> },
                  { value: 'all' as const, label: 'All of the above', icon: <Star className="w-6 h-6 text-primary" strokeWidth={1.5} /> },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setGoal(option.value); nextStep(); }}
                    className={`
                      w-full p-4 rounded-xl border-2 text-left flex items-center gap-3
                      transition-all duration-200
                      ${goal === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary-light hover:bg-primary-light/5'
                      }
                    `}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-base font-medium text-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </OnboardingCard>
        )}

        {step === 'level' && (
          <OnboardingCard key="level" onNext={nextStep}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-primary/80 font-medium uppercase tracking-wider mb-2">
                  Step 2 of 4
                </p>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Where are you starting from?
                </h2>
              </div>
              <div className="space-y-3">
                {([
                  { value: 'none' as const, label: "Complete beginner — I don't know any letters", desc: "Perfect! We'll start from the very beginning." },
                  { value: 'some_letters' as const, label: 'I know some letters but not all', desc: "Great start! We'll fill in the gaps." },
                  { value: 'read_slow' as const, label: 'I can read slowly but want to improve', desc: "We'll build your speed and confidence." },
                  { value: 'read_improve' as const, label: 'I can read but want to daven fluently', desc: "Let's focus on prayer reading fluency." },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setLevel(option.value); nextStep(); }}
                    className={`
                      w-full p-4 rounded-xl border-2 text-left
                      transition-all duration-200
                      ${level === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary-light hover:bg-primary-light/5'
                      }
                    `}
                  >
                    <span className="text-base font-medium text-foreground block">{option.label}</span>
                    <span className="text-sm text-gray-500 mt-1 block">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </OnboardingCard>
        )}

        {step === 'community' && (
          <OnboardingCard key="community" onNext={nextStep}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-primary/80 font-medium uppercase tracking-wider mb-2">
                  Step 3 of 4
                </p>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  What community are you connected to?
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  This helps us customize pronunciation
                </p>
              </div>
              <div className="space-y-3">
                {([
                  { value: 'ashkenaz' as const, label: 'Ashkenazi', desc: 'European tradition (most common in US)' },
                  { value: 'sefard' as const, label: 'Sephardi / Mizrachi / Chabad', desc: 'Middle Eastern / North African / Chassidic' },
                  { value: 'ashkenaz' as const, label: "I'm not sure yet", desc: "No problem — we'll start with Ashkenazi and you can change anytime in Settings" },
                ]).map((option, i) => (
                  <button
                    key={i}
                    onClick={() => { setNusach(option.value); nextStep(); }}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 text-left hover:border-primary-light hover:bg-primary-light/5 transition-all duration-200"
                  >
                    <span className="text-base font-medium text-foreground block">{option.label}</span>
                    <span className="text-sm text-gray-500 mt-1 block">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </OnboardingCard>
        )}

        {step === 'commitment' && (
          <OnboardingCard key="commitment" onNext={handleFinish}>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-primary/80 font-medium uppercase tracking-wider mb-2">
                  Step 4 of 4
                </p>
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  How much time can you give each day?
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Even 3 minutes a day makes a real difference
                </p>
              </div>
              <div className="space-y-3">
                {([
                  { value: 3, label: '3 minutes', desc: 'One quick drill — great for busy days' },
                  { value: 5, label: '5 minutes', desc: 'Perfect daily habit — recommended' },
                  { value: 10, label: '10 minutes', desc: 'Serious progress every day' },
                  { value: 15, label: '15+ minutes', desc: 'Fast track to reading fluency' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setDailyMinutes(option.value); handleFinish(); }}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 text-left hover:border-primary-light hover:bg-primary-light/5 transition-all duration-200"
                  >
                    <span className="text-base font-medium text-foreground block">{option.label}</span>
                    <span className="text-sm text-gray-500 mt-1 block">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </OnboardingCard>
        )}
      </AnimatePresence>
    </div>
  );
}

function OnboardingCard({
  children,
  onNext,
}: {
  children: React.ReactNode;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 p-10 relative overflow-hidden">
        {/* Subtle decorative manuscript corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-[3px] border-l-[3px] border-primary/5 rounded-tl-3xl m-2" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-[3px] border-r-[3px] border-primary/5 rounded-tr-3xl m-2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[3px] border-l-[3px] border-primary/5 rounded-bl-3xl m-2" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[3px] border-r-[3px] border-primary/5 rounded-br-3xl m-2" />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
