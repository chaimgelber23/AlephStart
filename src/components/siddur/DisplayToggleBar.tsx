'use client';

import { useUserStore } from '@/stores/userStore';
import type { DisplaySettings } from '@/types';

const TOGGLES: { key: keyof DisplaySettings; label: string }[] = [
  { key: 'showTransliteration', label: 'Translit.' },
  { key: 'showTranslation', label: 'English' },
  { key: 'showInstructions', label: 'Tips' },
  { key: 'showAmudCues', label: 'Amud' },
];

export function DisplayToggleBar() {
  const displaySettings = useUserStore((s) => s.displaySettings);
  const updateDisplaySettings = useUserStore((s) => s.updateDisplaySettings);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 py-2">
      {TOGGLES.map(({ key, label }) => {
        const isOn = displaySettings[key];
        return (
          <button
            key={key}
            onClick={() => updateDisplaySettings({ [key]: !isOn })}
            className="flex items-center justify-between min-h-[36px] px-1"
          >
            <span
              className={`text-xs font-medium transition-colors ${
                isOn ? 'text-foreground' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            <div
              className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                isOn ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isOn ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
