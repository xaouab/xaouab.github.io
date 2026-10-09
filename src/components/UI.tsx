// src/components/UI.tsx
import React from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import LanguageSwitch from './LanguageSwitch';
import FrontPageOverlay from './FrontPageOverlay';
import StarDetails from './StarDetails';
import Dock from './Dock';
import FlightReadout from './FlightReadout';
import { useNavigationStore } from '../stores/navigationStore';
import '../styles/UI.css';

const UI: React.FC = () => {
  const { currentView, selectedStarId } = useNavigationStore();
  const inStar = currentView === 'star';

  return (
    <MotionConfig reducedMotion="user">
      <div className={`ui-container ${inStar ? 'is-star' : 'is-home'}`}>
        <LanguageSwitch />
        <AnimatePresence>{!inStar && <FrontPageOverlay key="hero" />}</AnimatePresence>
        <AnimatePresence mode="popLayout">
          {inStar && selectedStarId && <StarDetails key={selectedStarId} starId={selectedStarId} />}
        </AnimatePresence>
        <FlightReadout />
        <Dock />
      </div>
    </MotionConfig>
  );
};

export default UI;
