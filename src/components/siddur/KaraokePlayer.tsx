'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import type { PrayerSection } from '@/types';

export function KaraokePlayer({
  section,
  prayerId,
  currentWordIndex,
  progress,
  onTogglePlay,
  onReplay,
  onSpeedChange,
  onWordTap,
  isPlaying,
  isLoading,
  isUnavailable,
}: {
  section: PrayerSection;
  prayerId: string;
  currentWordIndex: number;
  progress: number;
  onTogglePlay: () => void;
  onReplay?: () => void;
  onSpeedChange?: (speed: number) => void;
  onWordTap?: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  isUnavailable?: boolean;
}) {
  const displaySettings = useUserStore((s) => s.displaySettings);
  const audioSpeed = useUserStore((s) => s.profile.audioSpeed);
  const updateProfile = useUserStore((s) => s.updateProfile);

  const words = section.hebrewText.split(' ');
  const translitWords = section.transliteration.split(' ');

  const audioDisabled = isLoading || isUnavailable;

  return (
    <div className="space-y-4">
      {/* Audio Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Replay button */}
            {onReplay && (
              <button
                onClick={onReplay}
                disabled={audioDisabled}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  audioDisabled
                    ? 'bg-gray-100 text-gray-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                aria-label="Replay from beginning"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            )}

            {/* Play/Pause button */}
            <button
              onClick={onTogglePlay}
              disabled={audioDisabled}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 shadow-md ${
                isPlaying
                  ? 'bg-error text-white'
                  : audioDisabled
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-primary text-white hover:bg-[#163d55]'
              }`}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Speed control */}
          <span className="text-xs font-medium text-primary w-8 text-right">{audioSpeed}x</span>
        </div>

        {/* Audio coming soon message */}
        {isUnavailable && (
          <p className="text-sm text-gray-400 text-center py-1">
            Audio coming soon
          </p>
        )}

        {/* Speed slider */}
        {!isUnavailable && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] text-gray-300">Slow</span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.25}
              value={audioSpeed}
              onChange={(e) => {
                const newSpeed = parseFloat(e.target.value);
                if (onSpeedChange) {
                  onSpeedChange(newSpeed);
                } else {
                  updateProfile({ audioSpeed: newSpeed });
                }
              }}
              className="flex-1 accent-primary h-1"
            />
            <span className="text-[10px] text-gray-300">Fast</span>
          </div>
        )}
      </div>

      {/* Hebrew Text with Karaoke Highlighting */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div dir="rtl" className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 leading-[2.5]">
          {words.map((word, i) => {
            const isPast = i < currentWordIndex;
            const isCurrent = i === currentWordIndex;
            const isFuture = i > currentWordIndex;

            return (
              <motion.span
                key={i}
                onClick={onWordTap}
                className={`
                  font-[var(--font-hebrew-serif)] text-3xl px-1.5 py-0.5 rounded-lg
                  transition-all duration-200 cursor-pointer
                  ${isCurrent ? 'bg-primary-light/25 text-primary scale-105' : ''}
                  ${isPast && isPlaying ? 'text-primary/40' : ''}
                  ${isFuture && isPlaying ? 'text-[#1A1A2E]' : ''}
                  ${!isPlaying ? 'text-[#1A1A2E]' : ''}
                `}
                animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>

        {/* Transliteration with matching highlight */}
        {displaySettings.showTransliteration && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-[10px] uppercase tracking-widest text-primary/30 font-semibold mb-1 text-center">
              How to say it
            </p>
            <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-0.5">
              {translitWords.map((word, i) => {
                const isCurrent = i === currentWordIndex;
                return (
                  <span
                    key={i}
                    className={`text-base transition-all duration-200 ${
                      isCurrent
                        ? 'text-primary font-semibold'
                        : 'text-primary/50 italic'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Translation */}
        {displaySettings.showTranslation && section.translation && (
          <div className="mt-3 pt-3 border-t border-gray-50 text-center">
            <p className="text-[10px] uppercase tracking-widest text-primary/30 font-semibold mb-1">
              What it means
            </p>
            <p className="text-sm text-gray-400">{section.translation}</p>
          </div>
        )}

        {/* Notes */}
        {displaySettings.showInstructions && section.notes && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            <p className="text-sm text-gray-500">{section.notes}</p>
          </div>
        )}

        {/* Amud annotation */}
        {displaySettings.showAmudCues && section.amud && (
          <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
            {section.amud.instruction && (
              <p className="text-xs text-primary font-medium text-center">
                {section.amud.instruction}
              </p>
            )}
            {section.amud.congregationResponse && (
              <div className="bg-success/5 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-wider text-success font-semibold mb-1">
                  Congregation responds
                </p>
                <p dir="rtl" className="font-[var(--font-hebrew-serif)] text-lg text-success">
                  {section.amud.congregationResponse}
                </p>
                {section.amud.congregationResponseTransliteration && (
                  <p className="text-xs text-success/60 italic mt-0.5">
                    {section.amud.congregationResponseTransliteration}
                  </p>
                )}
              </div>
            )}
            {section.amud.physicalActions && section.amud.physicalActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {section.amud.physicalActions.map((action) => (
                  <span
                    key={action}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/15 text-[#8B6914] text-[10px] font-medium"
                  >
                    {action.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
