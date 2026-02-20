'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BottomNav } from '@/components/ui/BottomNav';
import { getTefillahPrayers, getBrachotPrayers } from '@/lib/content/prayers';
import { DAVENING_LEVELS } from '@/lib/content/davening-levels';
import { useAudio } from '@/hooks/useAudio';
import { useUserStore } from '@/stores/userStore';
import { CoachingOverlay } from '@/components/siddur/CoachingOverlay';
import type { Prayer } from '@/types';

type Tab = 'tefillah' | 'brachot';

export default function SiddurPage() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showCoaching, setShowCoaching] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const pronunciation = useUserStore((s) => s.profile.pronunciation);
  const audioSpeed = useUserStore((s) => s.profile.audioSpeed);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const hasUsedCoaching = useUserStore((s) => s.hasUsedCoaching);
  const isPrayerFullyCoached = useUserStore((s) => s.isPrayerFullyCoached);
  const audioOptions = useMemo(() => ({ speed: audioSpeed, pronunciation }), [audioSpeed, pronunciation]);
  const { play, stop, isPlaying, isLoading } = useAudio(audioOptions);

  if (!selectedPrayer) {
    return <PrayerList onSelect={setSelectedPrayer} />;
  }

  // Check if this prayer has been fully coached
  const sectionIds = selectedPrayer.sections.map((s) => s.id);
  const isCoached = isPrayerFullyCoached(selectedPrayer.id, sectionIds);
  const showFirstTimeBanner = !hasUsedCoaching && !isCoached && !dismissedBanner;

  const currentSection = selectedPrayer.sections[currentSectionIndex];
  const words = currentSection?.hebrewText.split(' ') || [];
  const totalSections = selectedPrayer.sections.length;

  const handleWordTap = (index: number) => {
    setHighlightedWordIndex(index);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setHighlightedWordIndex(-1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setHighlightedWordIndex(-1);
    }
  };

  // For long prayers (like Shemoneh Esrei), show a compact progress indicator
  const showCompactProgress = totalSections > 12;

  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => { setSelectedPrayer(null); setCurrentSectionIndex(0); }}
            className="text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
          <span className="text-sm font-medium text-gray-600">
            {selectedPrayer.nameEnglish}
          </span>
          <span className="text-sm text-gray-400">
            {currentSectionIndex + 1}/{totalSections}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* First-time coaching banner */}
        {showFirstTimeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#C6973F]/10 border border-[#C6973F]/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-xl">&#x1F393;</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3142]">First time?</p>
              <p className="text-xs text-gray-500">
                Tap &quot;Coach&quot; below to learn this step by step
              </p>
            </div>
            <button
              onClick={() => setDismissedBanner(true)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Prayer Context Card */}
        {currentSectionIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1B4965]/5 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">&#x1F4A1;</span>
              <div>
                <p className="text-sm font-medium text-[#1B4965]">
                  When: {selectedPrayer.whenSaid}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPrayer.inspirationText}
                </p>
                {selectedPrayer.whySaid && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    {selectedPrayer.whySaid}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Listen Controls */}
        <div className="space-y-2">
          <button
            onClick={() => {
              if (isPlaying) {
                stop();
              } else if (currentSection) {
                const text = pronunciation === 'american'
                  ? currentSection.transliteration
                  : currentSection.hebrewText;
                const audioMode = pronunciation === 'american' ? 'transliteration' : 'hebrew';
                play(text, audioMode, audioSpeed, selectedPrayer.id, currentSection.id);
              }
            }}
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
              isPlaying
                ? 'bg-[#C17767] text-white'
                : isLoading
                ? 'bg-gray-200 text-gray-400'
                : 'bg-[#1B4965] text-white hover:bg-[#163d55]'
            }`}
          >
            {isLoading ? 'Loading...' : isPlaying ? '⏹ Stop' : '▶ Listen'}
          </button>
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-gray-400 w-8">🐢</span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.25}
              value={audioSpeed}
              onChange={(e) => updateProfile({ audioSpeed: parseFloat(e.target.value) })}
              className="flex-1 accent-[#1B4965] h-1.5"
            />
            <span className="text-xs text-gray-400 w-8 text-right">🐇</span>
            <span className="text-xs font-medium text-[#1B4965] w-10 text-right">{audioSpeed}x</span>
          </div>
        </div>

        {/* Hebrew Text Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-100 p-8"
          >
            {/* Section label for Shemoneh Esrei */}
            {currentSection?.notes && currentSection.notes.startsWith('Bracha') && (
              <p className="text-xs font-semibold text-[#5FA8D3] uppercase tracking-wide mb-4 text-center">
                {currentSection.notes.split('.')[0]}
              </p>
            )}

            {/* Hebrew Text (with word-level interaction) */}
            <div dir="rtl" className="text-center space-y-1">
              <div className="flex flex-wrap justify-center gap-2 leading-[2.5]">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    onClick={() => handleWordTap(i)}
                    className={`
                      font-[var(--font-hebrew-serif)] text-3xl cursor-pointer
                      px-1 py-0.5 rounded transition-all duration-300
                      ${
                        highlightedWordIndex === i
                          ? 'bg-[#5FA8D3]/20 text-[#1B4965]'
                          : 'text-[#1A1A2E] hover:bg-[#5FA8D3]/10'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Transliteration — right under Hebrew so users can pronounce it */}
            {currentSection?.transliteration && (
              <div className="mt-2 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#1B4965]/40 font-semibold mb-0.5">How to say it</p>
                <p className="text-lg text-[#1B4965]/70 italic font-medium">
                  {currentSection.transliteration}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="mt-4 mb-2 border-t border-gray-100" />

            {/* Translation */}
            {currentSection?.translation && (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-[#1B4965]/40 font-semibold mb-0.5">What it means</p>
                <p className="text-sm text-gray-400">
                  {currentSection.translation}
                </p>
              </div>
            )}

            {/* Word-level notes */}
            {currentSection?.notes && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">{currentSection.notes}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentSectionIndex === 0
                ? 'text-gray-300'
                : 'text-[#1B4965] hover:bg-[#1B4965]/5'
            }`}
          >
            ← Previous
          </button>

          {/* Progress indicator */}
          {showCompactProgress ? (
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B4965] rounded-full transition-all duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{currentSectionIndex + 1}/{totalSections}</span>
            </div>
          ) : (
            <div className="flex gap-1">
              {selectedPrayer.sections.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentSectionIndex ? 'bg-[#1B4965]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleNextSection}
            disabled={currentSectionIndex === totalSections - 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentSectionIndex === totalSections - 1
                ? 'text-gray-300'
                : 'text-[#1B4965] hover:bg-[#1B4965]/5'
            }`}
          >
            Next →
          </button>
        </div>

      </div>

      {/* Coach me floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => { stop(); setShowCoaching(true); }}
        className="fixed bottom-24 right-6 bg-[#C6973F] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#b8892f] active:scale-95 transition-all flex items-center gap-2 z-20"
      >
        <span className="text-base">&#x1F393;</span>
        <span className="text-sm font-medium">Coach</span>
      </motion.button>

      {/* Coaching overlay */}
      <AnimatePresence>
        {showCoaching && (
          <CoachingOverlay
            prayer={selectedPrayer}
            initialSectionIndex={currentSectionIndex}
            onClose={() => setShowCoaching(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PrayerCard({ prayer, onSelect }: { prayer: Prayer; onSelect: (p: Prayer) => void }) {
  const isPrayerCoached = useUserStore((s) =>
    s.isPrayerFullyCoached(prayer.id, prayer.sections.map((sec) => sec.id))
  );

  return (
    <button
      onClick={() => onSelect(prayer)}
      className="w-full rounded-2xl border bg-white border-gray-100 hover:shadow-md hover:border-[#5FA8D3]/30 cursor-pointer p-4 text-left transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            isPrayerCoached
              ? 'bg-[#4A7C59]/10 text-[#4A7C59]'
              : 'bg-[#1B4965]/10 text-[#1B4965]'
          }`}>
            {isPrayerCoached ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              prayer.sortOrder
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[#2D3142] text-sm">{prayer.nameEnglish}</h3>
            <p dir="rtl" className="font-[var(--font-hebrew-serif)] text-base text-gray-500">
              {prayer.nameHebrew}
            </p>
          </div>
        </div>
        <span className="text-gray-300 text-lg">→</span>
      </div>
      {prayer.sections.length > 4 && (
        <div className="mt-2 flex items-center gap-2 ml-11">
          <span className="text-xs bg-[#1B4965]/5 text-[#1B4965] px-2 py-0.5 rounded-full font-medium">
            {prayer.sections.length} sections
          </span>
          {prayer.estimatedReadSeconds >= 60 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              ~{Math.ceil(prayer.estimatedReadSeconds / 60)} min
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function PrayerList({ onSelect }: { onSelect: (prayer: Prayer) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('tefillah');
  const [expandedLevel, setExpandedLevel] = useState<number>(1);

  const tefillahPrayers = getTefillahPrayers();
  const brachotPrayers = getBrachotPrayers();

  // Build a map of prayerId -> Prayer for quick lookup
  const prayerMap = new Map(tefillahPrayers.map((p) => [p.id, p]));

  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      {/* Header */}
      <div className="bg-[#1B4965] text-white px-6 py-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-[#5FA8D3] text-sm hover:text-white">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold mt-2">Your Siddur</h1>
          <p className="text-[#5FA8D3] text-sm mt-1">
            Build up to the full Shacharis, level by level
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('tefillah')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'tefillah'
                ? 'bg-white text-[#1B4965] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Davening
          </button>
          <button
            onClick={() => setActiveTab('brachot')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'brachot'
                ? 'bg-white text-[#1B4965] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Brachos
          </button>
        </div>

        {activeTab === 'tefillah' ? (
          <div className="space-y-4">
            {/* Level progression */}
            {DAVENING_LEVELS.map((level) => {
              const isExpanded = expandedLevel === level.level;
              const levelPrayers = level.prayerIds
                .map((id) => prayerMap.get(id))
                .filter(Boolean) as Prayer[];

              return (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: level.level * 0.05 }}
                >
                  {/* Level header */}
                  <button
                    onClick={() => setExpandedLevel(isExpanded ? -1 : level.level)}
                    className="w-full text-left"
                  >
                    <div className={`rounded-2xl border-2 p-4 transition-all ${
                      isExpanded
                        ? 'border-[#1B4965] bg-[#1B4965]/5'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            isExpanded
                              ? 'bg-[#1B4965] text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {level.level}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#2D3142]">{level.title}</h3>
                            <p className="text-xs text-gray-500">{level.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{levelPrayers.length} prayers</span>
                          <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            ▾
                          </span>
                        </div>
                      </div>

                      {!isExpanded && (
                        <p className="text-xs text-gray-400 mt-2 ml-[52px]">
                          {level.description}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Expanded prayers */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pl-5 border-l-2 border-[#1B4965]/20 ml-7 space-y-2 mt-2">
                          <p className="text-sm text-gray-600 mb-3 pl-4">
                            {level.description}
                          </p>
                          {levelPrayers.map((prayer) => (
                            <PrayerCard key={prayer.id} prayer={prayer} onSelect={onSelect} />
                          ))}
                        </div>
                        <p className="text-xs text-[#4A7C59] font-medium mt-3 ml-[52px]">
                          {level.milestone}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-4 px-1">
              Blessings over food and drink — know which bracha to say and when
            </p>
            {brachotPrayers.map((prayer, i) => (
              <motion.div
                key={prayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <PrayerCard prayer={prayer} onSelect={onSelect} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
