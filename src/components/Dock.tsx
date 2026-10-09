// src/components/Dock.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { starsData } from '../data/starsData';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';
import { SPRING } from '../util/motion';

const Dock: React.FC = () => {
  const { currentLanguage, t } = useLanguageStore();
  const { setView, currentView, selectedStarId } = useNavigationStore();
  const inStar = currentView === 'star';

  const items = [
    { id: null as string | null, label: t('navigation.overview'), color: '#d8dce6' },
    ...starsData.map((s) => ({ id: s.id as string | null, label: s.title[currentLanguage], color: s.color })),
  ];

  return (
    <div className={`dock-anchor ${inStar ? 'with-panel' : ''}`}>
      <motion.nav
        className="dock material"
        aria-label="Destinations"
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ ...SPRING, delay: 0.3 }}
      >
        {items.map((item) => {
          const active = item.id === null ? !inStar : inStar && selectedStarId === item.id;
          return (
            <button
              key={item.id ?? 'home'}
              type="button"
              className={`dock-item ${active ? 'active' : ''}`}
              style={{ '--accent': item.color } as React.CSSProperties}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              onClick={() => (item.id ? setView('star', item.id) : setView('home'))}
            >
              {active && <motion.span layoutId="dock-active" className="dock-active" transition={SPRING} />}
              <span className="planet-glyph" aria-hidden />
              <span className="dock-label">{item.label}</span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default Dock;
