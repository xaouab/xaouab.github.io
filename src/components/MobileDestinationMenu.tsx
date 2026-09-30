import React, { useEffect, useState } from 'react';
import { starsData } from '../data/starsData';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';
import '../styles/MobileDestinationMenu.css';

const MobileDestinationMenu: React.FC = () => {
  const { currentLanguage } = useLanguageStore();
  const { setView, currentView, selectedStarId } = useNavigationStore();

  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  if (!isMobile) return null;

  const handleSelect = (id: string) => {
    setView('star', id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="mobile-destination-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        Destinations
      </button>

      <div className={`mobile-destination-sheet ${open ? 'open' : ''}`}>
        <div className="mobile-destination-header">
          <h3>Destination</h3>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        <div className="mobile-destination-list">
          <button
            type="button"
            className={`mobile-destination-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => {
              setView('home');
              setOpen(false);
            }}
            disabled={currentView === 'home' || currentView === 'start'}
          >
            <span>System Orbit</span>
            <span>HOME</span>
          </button>

          {starsData.map((star) => {
            const active = currentView === 'star' && selectedStarId === star.id;
            return (
              <button
                key={star.id}
                type="button"
                className={`mobile-destination-item ${active ? 'active' : ''}`}
                onClick={() => handleSelect(star.id)}
                disabled={active}
              >
                <span>{star.title[currentLanguage]}</span>
                <span>{star.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="mobile-destination-backdrop"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
};

export default MobileDestinationMenu;
