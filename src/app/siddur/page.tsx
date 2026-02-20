'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BottomNav } from '@/components/ui/BottomNav';
import { getTefillahPrayers, getBrachotPrayers } from '@/lib/content/prayers';
import { useUserStore } from '@/stores/userStore';
import type { Prayer } from '@/types';

type Tab = 'tefillah' | 'brachot';

export default function SiddurPage() {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [mode, setMode] = useState<'listen' | 'read'>('listen');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);

  if (!selectedPrayer) {
    return <PrayerList onSelect={setSelectedPrayer} />;
  }

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
        {/* Prayer Context Card */}
        {currentSectionIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1B4965]/5 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">💡</span>
              <div>
                <p className="text-sm font-medium text-[#1B4965]">
                  When: {selectedPrayer.whenSaid}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPrayer.inspirationText}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMode('listen')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'listen'
                ? 'bg-white text-[#1B4965] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👂 Listen
          </button>
          <button
            onClick={() => setMode('read')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'read'
                ? 'bg-white text-[#1B4965] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📖 Read
          </button>
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

            {/* Transliteration */}
            {showTransliteration && currentSection?.transliteration && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-base text-gray-400 mt-4 italic"
              >
                {currentSection.transliteration}
              </motion.p>
            )}

            {/* Translation */}
            {showTranslation && currentSection?.translation && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-base text-gray-500 mt-3"
              >
                {currentSection.translation}
              </motion.p>
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

        {/* Toggle buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
              showTransliteration
                ? 'border-[#1B4965] text-[#1B4965] bg-[#1B4965]/5'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            Transliteration {showTransliteration ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
              showTranslation
                ? 'border-[#1B4965] text-[#1B4965] bg-[#1B4965]/5'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            Translation {showTranslation ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrayerList({ onSelect }: { onSelect: (prayer: Prayer) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('tefillah');
  const userLevel = useUserStore((s) => s.profile.currentLevel);

  const tefillahPrayers = getTefillahPrayers();
  const brachotPrayers = getBrachotPrayers();
  const prayers = activeTab === 'tefillah' ? tefillahPrayers : brachotPrayers;

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
            Learn each prayer and bracha step by step
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
            Tefillah
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

        {/* Section description */}
        <p className="text-xs text-gray-400 mb-4 px-1">
          {activeTab === 'tefillah'
            ? 'Core prayers of the daily davening — from Modeh Ani to the full Amidah'
            : 'Blessings over food and drink — know which bracha to say and when'}
        </p>

        {/* Prayer cards */}
        <div className="space-y-3">
          {prayers.map((prayer, i) => {
            const isLocked = userLevel < prayer.requiredLevel;

            return (
              <motion.div
                key={prayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => !isLocked && onSelect(prayer)}
                  disabled={isLocked}
                  className={`w-full rounded-2xl border p-5 text-left transition-all ${
                    isLocked
                      ? 'bg-gray-50 border-gray-100 opacity-70 cursor-not-allowed'
                      : 'bg-white border-gray-100 hover:shadow-md hover:border-[#5FA8D3]/30 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon / Lock */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isLocked
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-[#1B4965]/10 text-[#1B4965]'
                      }`}>
                        {isLocked ? '🔒' : prayer.sortOrder}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-[#2D3142]'}`}>
                          {prayer.nameEnglish}
                        </h3>
                        <p
                          dir="rtl"
                          className={`font-[var(--font-hebrew-serif)] text-lg mt-0.5 ${
                            isLocked ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {prayer.nameHebrew}
                        </p>
                        <p className={`text-xs mt-1 ${isLocked ? 'text-gray-300' : 'text-gray-400'}`}>
                          {isLocked
                            ? `Unlocks at Level ${prayer.requiredLevel}`
                            : prayer.whenSaid}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xl ${isLocked ? 'text-gray-200' : 'text-gray-300'}`}>
                      {isLocked ? '' : '→'}
                    </span>
                  </div>

                  {/* Sections count badge */}
                  {!isLocked && prayer.sections.length > 4 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs bg-[#1B4965]/5 text-[#1B4965] px-2.5 py-1 rounded-full font-medium">
                        {prayer.sections.length} sections
                      </span>
                      {prayer.estimatedReadSeconds >= 60 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          ~{Math.ceil(prayer.estimatedReadSeconds / 60)} min
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
