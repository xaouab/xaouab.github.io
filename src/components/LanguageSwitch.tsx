// src/components/LanguageSwitch.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';
import type { Language } from '../stores/languageStore';
import { SPRING } from '../util/motion';

const OPTIONS: { value: Language; label: string; full: string }[] = [
  { value: 'en', label: 'EN', full: 'English' },
  { value: 'fr', label: 'FR', full: 'Français' },
];

const LanguageSwitch: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();

  return (
    <div className="segmented material" role="radiogroup" aria-label="Language">
      {OPTIONS.map((o) => {
        const active = currentLanguage === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.full}
            className={active ? 'active' : ''}
            onClick={() => setLanguage(o.value)}
          >
            {active && <motion.span layoutId="segmented-thumb" className="segmented-thumb" transition={SPRING} />}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitch;
