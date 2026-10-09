// src/components/FrontPageOverlay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../stores/languageStore';
import { SPRING } from '../util/motion';

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 12, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(10px)', transition: { duration: 0.25 } },
  transition: { ...SPRING, duration: 0.7, delay },
});

const FrontPageOverlay: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <header className="hero">
      <motion.h1 className="hero-title" {...enter(0.2)}>Aouab Admou</motion.h1>
      <motion.p className="hero-role" {...enter(0.3)}>{t('frontPage.role')}</motion.p>
      <motion.p className="hero-hint" {...enter(0.6)}>{t('frontPage.subtitle')}</motion.p>
    </header>
  );
};

export default FrontPageOverlay;
