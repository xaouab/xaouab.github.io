// src/components/FlightReadout.tsx
// The trajectory plot shown while the ship is in transfer, driven by the real flight progress.
import React from 'react';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { starsData } from '../data/starsData';
import { telemetry } from '../flight/telemetry';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';
import { SPRING } from '../util/motion';

const ARC = 'M6 26 Q100 -6 194 26';

const FlightReadout: React.FC = () => {
  const { currentView, selectedStarId, isTransitioning } = useNavigationStore();
  const { currentLanguage, t } = useLanguageStore();
  const progress = useMotionValue(0);
  const shipOffset = useTransform(progress, (p) => `${p * 100}%`);

  useAnimationFrame(() => progress.set(telemetry.progress));

  const star = starsData.find((s) => s.id === selectedStarId);
  const toPlanet = currentView === 'star' && !!star;
  const show = isTransitioning && currentView !== 'start';

  return (
    <div className="readout-anchor">
      <AnimatePresence>
        {show && (
          <motion.div
            key={toPlanet ? star!.id : 'home'}
            className="readout"
            role="status"
            style={{ '--accent': toPlanet ? star!.color : '#d8dce6' } as React.CSSProperties}
            initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
            transition={SPRING}
          >
            <p className="readout-text">
              {toPlanet ? t('flight.approaching') : t('flight.returning')}{' '}
              <strong>{toPlanet ? star!.title[currentLanguage] : t('navigation.overview')}</strong>
            </p>
            <div className="readout-plot">
              <svg className="readout-arc" viewBox="0 0 200 32" aria-hidden>
                <path d={ARC} className="readout-arc-path" pathLength={1} />
                <motion.path d={ARC} className="readout-arc-flown" pathLength={1} style={{ pathLength: progress }} />
                <circle cx="194" cy="26" r="4.5" className="readout-target" />
              </svg>
              <motion.span className="readout-ship" style={{ offsetDistance: shipOffset }} aria-hidden />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlightReadout;
