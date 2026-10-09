// src/components/StarDetails.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { starsData } from '../data/starsData';
import { useLanguageStore } from '../stores/languageStore';
import { useNavigationStore } from '../stores/navigationStore';
import { renderRichText } from '../util/util';
import { useIsMobile } from '../util/useIsMobile';
import { FLICK_SPRING, SPRING, project } from '../util/motion';
import { ArrowUpRight, CaretLeft, CaretRight, DownloadSimple, X } from '@phosphor-icons/react';

const IMG_TAG = /\[img=(.*?)\]\n?/i;

/** Pull the first inline image out so it can lead the card as a hero. */
function splitHero(description: string) {
  const match = description.match(IMG_TAG);
  return { hero: match?.[1] ?? null, body: match ? description.replace(IMG_TAG, '') : description };
}

const cardVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, filter: 'blur(6px)' }),
};

/** Fraction of the sheet hidden below the fold in its resting "half" position. */
const SHEET_MID = 0.42;

interface Props {
  starId: string;
}

const StarDetails: React.FC<Props> = ({ starId }) => {
  const { setView } = useNavigationStore();
  const { currentLanguage, t } = useLanguageStore();
  const isMobile = useIsMobile();
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const [introOpen, setIntroOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const star = starsData.find((s) => s.id === starId)!;
  const content = star.content[currentLanguage];
  const count = content.items.length;
  const item = content.items[Math.min(index, count - 1)];
  const { hero, body } = splitHero(item.description);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped === index) return;
    setPage([clamped, clamped > index ? 1 : -1]);
  };

  // Keep the active rail chip in view and reset the reading position.
  useEffect(() => {
    railRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    stageRef.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('home');
      else if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---- Mobile bottom sheet -------------------------------------------------
  const sheetRef = useRef<HTMLElement>(null);
  const sheetY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight : 800);
  const dragControls = useDragControls();
  const [sheetH, setSheetH] = useState(0);
  const mid = sheetH * SHEET_MID;

  useLayoutEffect(() => {
    if (!isMobile || !sheetRef.current) return;
    const h = sheetRef.current.offsetHeight;
    setSheetH(h);
    const controls = animate(sheetY, h * SHEET_MID, SPRING);
    return () => controls.stop();
  }, [isMobile, sheetY]);

  const onSheetDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const projected = sheetY.get() + project(velocity);
    if (projected > mid + (sheetH - mid) * 0.5) {
      setView('home');
      return;
    }
    const target = Math.abs(projected) < Math.abs(projected - mid) ? 0 : mid;
    animate(sheetY, target, { ...FLICK_SPRING, velocity });
  };

  // Reading in the half-open sheet expands it; the scroll gesture hints the intent.
  const onStageScroll = () => {
    if (isMobile && sheetY.get() > 1 && (stageRef.current?.scrollTop ?? 0) > 8) {
      animate(sheetY, 0, SPRING);
    }
  };

  const onCardDragEnd = (_: unknown, info: PanInfo) => {
    const projected = info.offset.x + project(info.velocity.x, 0.99);
    if (projected < -90) go(index + 1);
    else if (projected > 90) go(index - 1);
  };

  const accentStyle = { '--accent': star.color } as React.CSSProperties;

  const panelMotion = isMobile
    ? {
        style: { ...accentStyle, y: sheetY },
        drag: 'y' as const,
        dragControls,
        dragListener: false,
        dragMomentum: false,
        dragConstraints: { top: 0, bottom: sheetH },
        dragElastic: { top: 0.08, bottom: 1 },
        onDragEnd: onSheetDragEnd,
        exit: { y: typeof window !== 'undefined' ? window.innerHeight : 800, transition: SPRING },
      }
    : {
        style: accentStyle,
        initial: { opacity: 0, x: -32, scale: 0.98, filter: 'blur(12px)' },
        animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -32, scale: 0.98, filter: 'blur(12px)' },
        transition: SPRING,
      };

  const startSheetDrag = (e: React.PointerEvent) => {
    if (isMobile) dragControls.start(e);
  };

  return (
    <motion.aside
      ref={sheetRef}
      className={`panel material-thick ${isMobile ? 'is-sheet' : ''}`}
      aria-label={star.title[currentLanguage]}
      {...panelMotion}
    >
      <div className="panel-grab" onPointerDown={startSheetDrag}>
        {isMobile && <span className="sheet-handle" aria-hidden />}
        <header className="panel-header">
          <div className="panel-heading">
            <span className="planet-glyph panel-glyph" aria-hidden />
            <h2 className="panel-title">{star.title[currentLanguage]}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={t('navigation.close')}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setView('home')}
          >
            <X size={16} weight="bold" />
          </button>
        </header>
        <button
          type="button"
          className={`panel-intro ${introOpen ? 'open' : ''}`}
          aria-expanded={introOpen}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setIntroOpen((o) => !o)}
        >
          {renderRichText(content.description)}
        </button>
      </div>

      {count > 1 && (
        <div className="rail" ref={railRef} role="tablist">
          {content.items.map((it, i) => {
            const thumb = splitHero(it.description).hero;
            const active = i === index;
            return (
              <button
                key={i}
                data-index={i}
                type="button"
                role="tab"
                aria-selected={active}
                className={`rail-item ${active ? 'active' : ''} ${thumb ? '' : 'no-thumb'}`}
                onClick={() => go(i)}
              >
                {active && <motion.span layoutId={`rail-active-${starId}`} className="rail-active" transition={SPRING} />}
                {thumb && (
                  <span className="rail-thumb">
                    <img src={thumb} alt="" loading="lazy" />
                  </span>
                )}
                <span className="rail-text">
                  <span className="rail-title">{it.title}</span>
                  {it.subtitle && <span className="rail-subtitle">{it.subtitle}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="stage" ref={stageRef} onScroll={onStageScroll}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.article
            key={`${starId}-${index}-${currentLanguage}`}
            className="card"
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING}
            drag={isMobile && count > 1 ? 'x' : false}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={onCardDragEnd}
          >
            {hero && (
              <figure className="card-hero">
                <img src={hero} alt={item.title} draggable={false} />
              </figure>
            )}
            <h3 className="card-title">{item.title}</h3>
            {item.subtitle && <p className="card-subtitle">{item.subtitle}</p>}
            <div className="card-body">{renderRichText(body)}</div>

            {item.links.length > 0 && (
              <div className="card-links">
                {item.links.map((link, i) => (
                  <a key={i} className="pill-link" href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.text}
                    {link.link.endsWith('.pdf') ? <DownloadSimple size={14} weight="bold" /> : <ArrowUpRight size={14} weight="bold" />}
                  </a>
                ))}
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <footer className="pager">
          <button type="button" className="icon-button" aria-label={t('navigation.previous')} disabled={index === 0} onClick={() => go(index - 1)}>
            <CaretLeft size={16} weight="bold" />
          </button>
          {index < count - 1 ? (
            <button type="button" className="pager-next" onClick={() => go(index + 1)}>
              <span className="pager-next-label">{t('navigation.next')}</span>
              <span className="pager-next-title">{content.items[index + 1].title}</span>
              <CaretRight size={14} weight="bold" />
            </button>
          ) : (
            <button type="button" className="pager-next" onClick={() => go(0)}>
              <span className="pager-next-label">{t('navigation.backToStart')}</span>
              <span className="pager-next-title">{content.items[0].title}</span>
            </button>
          )}
        </footer>
      )}
    </motion.aside>
  );
};

export default StarDetails;
