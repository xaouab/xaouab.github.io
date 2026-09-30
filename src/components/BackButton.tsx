// src/components/BackButton.tsx
import React from 'react';
import { useNavigationStore } from '../stores/navigationStore';
import { useLanguageStore } from '../stores/languageStore';
import '../styles/BackButton.css';

const BackButton: React.FC = () => {
  const { setView } = useNavigationStore();
  const { t } = useLanguageStore();

  const handleBack = () => {
    setView('home');
  };

  return (
    <button className="back-button" onClick={handleBack}>
      {t('navigation.back')}
    </button>
  );
};

export default BackButton;