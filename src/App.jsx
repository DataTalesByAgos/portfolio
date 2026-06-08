import React, { useState } from 'react'
import portfolioData from './data'

/* ── Video Background Container ── */
const VideoContainer = ({ children }) => {
  const [style, setStyle] = useState({});

  React.useEffect(() => {
    const updateSize = () => {
      const videoRatio = 16 / 9; // standard 1080p video aspect ratio
      const screenRatio = window.innerWidth / window.innerHeight;
      let width, height, top, left;

      if (screenRatio > videoRatio) {
        width = window.innerWidth;
        height = window.innerWidth / videoRatio;
        left = 0;
        top = (window.innerHeight - height) / 2;
      } else {
        height = window.innerHeight;
        width = window.innerHeight * videoRatio;
        top = 0;
        left = (window.innerWidth - width) / 2;
      }

      setStyle({
        position: 'fixed',
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1,
        pointerEvents: 'none',
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return <div style={style}>{children}</div>;
};

/* ── Live Lofi Clock Component ── */
const LofiClock = () => {
  const [time, setTime] = useState('');

  React.useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Default coordinate guesses for the clock (glowing green pixel-clock)
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('lofi-clock-position');
    return saved ? JSON.parse(saved) : { top: 38.2, left: 45.4, fontSize: 1.6, color: '#39ff14' };
  });

  const [editMode, setEditMode] = useState(false);

  // Toggle edit mode with a shortcut (Shift+Alt+C) or double click
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'c') {
        setEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const save = (newPos) => {
    setPosition(newPos);
    localStorage.setItem('lofi-clock-position', JSON.stringify(newPos));
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        fontSize: `${position.fontSize}vw`,
        color: position.color,
        fontFamily: "'VT323', monospace",
        textShadow: `0 0 4px ${position.color}, 0 0 12px ${position.color}`,
        transform: 'translate(-50%, -50%)',
        userSelect: 'none',
        lineHeight: 1,
        pointerEvents: editMode ? 'auto' : 'none',
        cursor: editMode ? 'move' : 'default',
        zIndex: 100,
      }}
      onDoubleClick={() => setEditMode(!editMode)}
    >
      {time}

      {editMode && (
        <div style={{
          position: 'absolute',
          top: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #4ade80',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#fff',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '240px',
          pointerEvents: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontWeight: 'bold', color: '#4ade80', borderBottom: '1px solid #334155', paddingBottom: '4px' }}>
            Ajustar Reloj (Alt+Shift+C)
          </div>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Top: {position.top.toFixed(1)}%</span>
            <input type="range" min="0" max="100" step="0.1" value={position.top} onChange={e => save({ ...position, top: parseFloat(e.target.value) })} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Left: {position.left.toFixed(1)}%</span>
            <input type="range" min="0" max="100" step="0.1" value={position.left} onChange={e => save({ ...position, left: parseFloat(e.target.value) })} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tamaño: {position.fontSize.toFixed(2)}vw</span>
            <input type="range" min="0.5" max="5" step="0.05" value={position.fontSize} onChange={e => save({ ...position, fontSize: parseFloat(e.target.value) })} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Color:</span>
            <input type="color" value={position.color} onChange={e => save({ ...position, color: e.target.value })} />
          </label>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
            Doble clic en el reloj para cerrar.
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Inline SVG Icons ── */
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
)
const IconGithub = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
)
const IconLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
)
const IconDatabase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>
)
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>
)
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
)
const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
)
const IconGithubSmall = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
)
const IconDeploy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
)
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
)
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
)
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
)
const IconChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
)
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
)
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
)

const s = {
  page: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative',
  },
  orbA: { display: 'none' },
  orbB: { display: 'none' },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: '18px 0',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
  },
  navInner: { maxWidth: 920, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: -0.5, cursor: 'pointer', fontFamily: "'VT323', monospace" },
  logoAccent: { color: '#4ade80' },
  navLinks: { display: 'flex', gap: 28, fontSize: 14, fontWeight: 500, alignItems: 'center' },
  navLink: { color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'JetBrains Mono', monospace" },
  main: { position: 'relative', zIndex: 10, maxWidth: 920, margin: '0 auto', padding: '140px 28px 80px' },

  badge: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', fontSize: 13, fontWeight: 600, border: '1px solid rgba(74, 222, 128, 0.3)', marginBottom: 28, width: 'fit-content' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' },
  h1: { fontSize: 'clamp(44px, 7vw, 92px)', fontWeight: 400, color: '#fff', letterSpacing: '0px', lineHeight: 1.05, margin: '0 0 22px', fontFamily: "'VT323', monospace", textShadow: '0 4px 12px rgba(0,0,0,0.6)' },
  gradient: { background: 'linear-gradient(135deg, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  subtitle: { fontSize: 16, color: '#e2e8f0', maxWidth: 580, lineHeight: 1.75, margin: '0 0 36px', fontWeight: 400, textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  strong: { color: '#4ade80', fontWeight: 600 },
  btns: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#16a34a', color: '#fff', padding: '12px 26px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.08)', color: '#e2e8f0', padding: '12px 26px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: 'pointer', transition: 'all 0.25s', backdropFilter: 'blur(10px)' },

  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, margin: '72px 0' },
  card: { padding: 26, background: 'rgba(15, 23, 42, 0.75)', borderRadius: 18, border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)', transition: 'all 0.3s', cursor: 'default', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
  cardIcon: { width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 20, fontWeight: 400, color: '#fff', margin: '0 0 6px', fontFamily: "'VT323', monospace" },
  cardDesc: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 },

  sectionTag: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: '#4ade80', margin: '0 0 8px', fontFamily: "'JetBrains Mono', monospace" },
  h2: { fontSize: 44, fontWeight: 400, color: '#fff', letterSpacing: '0px', margin: '0 0 36px', fontFamily: "'VT323', monospace", textShadow: '0 2px 8px rgba(0,0,0,0.5)' },

  projectCard: { background: 'rgba(15, 23, 42, 0.75)', borderRadius: 18, border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)', overflow: 'hidden', transition: 'all 0.3s', marginBottom: 24, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
  projectInner: { display: 'flex' },
  projectImg: { width: '40%', minHeight: 240, background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(15, 23, 42, 0.5))', flexShrink: 0, overflow: 'hidden' },
  projectContent: { flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 14 },
  projectYear: { display: 'inline-block', padding: '3px 10px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: 11, fontWeight: 700, borderRadius: 999, textTransform: 'uppercase', letterSpacing: 2, width: 'fit-content' },
  projectTitle: { fontSize: 26, fontWeight: 400, color: '#fff', lineHeight: 1.3, margin: 0, transition: 'color 0.2s', fontFamily: "'VT323', monospace" },
  projectDesc: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 },
  metric: { display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 650, border: '1px solid rgba(74, 222, 128, 0.2)', width: 'fit-content' },
  tools: { display: 'flex', flexWrap: 'wrap', gap: 7 },
  tool: { padding: '4px 11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: 11, fontWeight: 600, borderRadius: 7 },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, margin: '72px 0', alignItems: 'start' },
  expCard: { padding: 22, background: 'rgba(15, 23, 42, 0.75)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)', marginBottom: 14, transition: 'border-color 0.2s', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
  expPeriod: { fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: 2, margin: 0 },
  expRole: { fontSize: 20, fontWeight: 400, color: '#fff', margin: '4px 0 2px', fontFamily: "'VT323', monospace" },
  expCompany: { fontSize: 13, color: '#94a3b8', fontWeight: 500, margin: '0 0 10px' },
  expDesc: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 },

  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: 9 },
  skill: { padding: '9px 16px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: 13, fontWeight: 600, borderRadius: 11, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', cursor: 'default', transition: 'all 0.2s', backdropFilter: 'blur(12px)' },

  darkBox: { marginTop: 28, padding: 26, background: 'rgba(15, 23, 42, 0.85)', borderRadius: 18, color: '#fff', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' },
  darkOrb: { position: 'absolute', top: 0, right: 0, width: 140, height: 140, background: 'rgba(74, 222, 128, 0.12)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' },
  darkTag: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: '#4ade80', margin: '0 0 8px' },
  darkTitle: { fontSize: 20, fontWeight: 400, color: '#fff', margin: '0 0 10px', fontFamily: "'VT323', monospace" },
  darkDesc: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0, position: 'relative', zIndex: 1 },

  contactSection: { textAlign: 'center', padding: '56px 0 40px' },
  contactH2: { fontSize: 48, fontWeight: 400, color: '#fff', letterSpacing: '0px', margin: '0 0 14px', fontFamily: "'VT323', monospace" },
  contactP: { fontSize: 16, color: '#cbd5e1', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 },
  contactBtns: { display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 52 },
  circleBtn: { width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.15)', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.75)', color: '#cbd5e1', backdropFilter: 'blur(10px)' },
  mailBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 46, padding: '0 22px', borderRadius: 999, background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', border: 'none', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' },
  footer: { borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#94a3b8', fontWeight: 500 },
}

function App() {
  const [language, setLanguage] = useState('es')
  const [activeTab, setActiveTab] = useState('Standalone')
  const [lightbox, setLightbox] = useState(null)
  const [activePost, setActivePost] = useState(null)
  const [activeSkillGroup, setActiveSkillGroup] = useState('software-dev')
  const [skillsPage, setSkillsPage] = useState(0)
  const data = portfolioData[language]
  
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  React.useEffect(() => {
    // Obfuscated email reconstruction to prevent easy automated scraping
    const parts = ['agostina', 'dev', 'dc', 'gmail.com']
    setEmailAddress(`${parts[0]}.${parts[1]}.${parts[2]}@${parts[3]}`)
  }, [])

  // Sync activePost from/to URL hash using slug for descriptive sharing links
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const post = portfolioData[language].blogPosts.find(p => p.slug === hash);
        if (post) {
          setActivePost(post);
          return;
        }
      }
      if (window.location.hash.startsWith('#') && !['blog', 'projects', 'about', 'contact'].includes(hash)) {
        // Unknown hash, ignore
      } else {
        setActivePost(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [language]);

  React.useEffect(() => {
    if (activePost && activePost.slug) {
      if (window.location.hash !== `#${activePost.slug}`) {
        window.history.pushState(null, '', `#${activePost.slug}`);
      }
    } else if (!activePost && window.location.hash && !['#blog', '#projects', '#about', '#contact'].includes(window.location.hash)) {
      window.history.pushState(null, '', '#blog');
    }
  }, [activePost]);

  const handleCopyEmail = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(emailAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const filteredProjects = data.projects.filter(p => p.category === activeTab)

  // Scroll locking when modal/reader is open
  React.useEffect(() => {
    if (activePost || lightbox) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [activePost, lightbox])

  // Keyboard navigation for Lightbox and Blog Reader
  React.useEffect(() => {
    if (!lightbox && !activePost) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null)
        setActivePost(null)
      } else if (lightbox && e.key === 'ArrowRight') {
        setLightbox(prev => {
          if (!prev) return null
          const nextIndex = (prev.index + 1) % prev.images.length
          return { ...prev, index: nextIndex }
        })
      } else if (lightbox && e.key === 'ArrowLeft') {
        setLightbox(prev => {
          if (!prev) return null
          const prevIndex = (prev.index - 1 + prev.images.length) % prev.images.length
          return { ...prev, index: prevIndex }
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, activePost])

  return (
    <div style={s.page}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source src="/ui/Enhancer-HD-Upscaler-1080P - HD-bg_done.mp4" type="video/mp4" />
      </video>

      {/* Background Dimming Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.7) 60%, rgba(15, 23, 42, 0.92) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Sunset Window Glow Effect */}
      <div
        style={{
          position: 'fixed',
          top: '40%',
          left: '25%',
          width: '0px',
          height: '0px',
          boxShadow: '0 0 160px 80px rgba(255, 140, 70, 0.09)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />


      {/* Inject CSS Animations for Lofi Room overlays */}
      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(0.9); opacity: 0; }
          40% { opacity: 0.5; }
          100% { transform: translateY(-16px) scale(1.3); opacity: 0; }
        }
        @keyframes monitorGlow {
          0%, 100% { opacity: 0.35; box-shadow: 0 0 10px rgba(74, 222, 128, 0.4); }
          50% { opacity: 0.65; box-shadow: 0 0 25px rgba(74, 222, 128, 0.8); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 4px 14px rgba(22, 163, 74, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 6px 22px rgba(22, 163, 74, 0.7), 0 0 0 6px rgba(74, 222, 128, 0.2);
            transform: scale(1.025);
          }
        }
        .cta-button {
          animation: pulseGlow 2.5s infinite ease-in-out;
        }
        .cta-button:hover {
          background-color: #15803d !important;
          box-shadow: 0 8px 28px rgba(22, 163, 74, 0.8), 0 0 0 10px rgba(74, 222, 128, 0.3) !important;
          transform: translateY(-2px) scale(1.04) !important;
        }
        .social-btn {
          transition: all 0.2s ease-in-out !important;
        }
        .social-btn:hover {
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: 0 6px 16px rgba(74, 222, 128, 0.25) !important;
        }
        .scroll-indicator:hover {
          opacity: 0.95 !important;
          transform: scale(1.08) !important;
        }
        @keyframes floatScroll {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }
        .scroll-arrow-wrapper {
          animation: floatScroll 1.8s infinite ease-in-out;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @media (max-width: 768px) {
          .responsive-hero-section {
            align-items: center !important;
            justify-content: center !important;
            margin: 0 0 60px !important;
          }
          .responsive-hero-card {
            margin-bottom: 0 !important;
            transform: none !important;
            max-width: 100% !important;
            padding: 22px 20px 18px !important;
          }
          .responsive-grid2 {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .responsive-project-inner {
            flex-direction: column !important;
          }
          .responsive-project-img {
            width: 100% !important;
            height: 200px !important;
            min-height: auto !important;
          }
        }
      `}</style>

      <div style={s.orbA} />
      <div style={s.orbB} />

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ ...s.logo, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>data.<span style={s.logoAccent}>tales</span></span>
          <div style={s.navLinks}>
            <a href="#about" style={s.navLink}>{data.nav.profile}</a>
            <a href="#blog" style={s.navLink}>{data.nav.blog}</a>

            {/* Bilingual Switch Slider */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '3px', borderRadius: '999px', border: '1px solid #e2e8f0', marginLeft: '12px' }}>
              <button
                onClick={() => setLanguage('es')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: language === 'es' ? '#fff' : 'transparent',
                  color: language === 'es' ? '#16a34a' : '#64748b',
                  boxShadow: language === 'es' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                ESP
              </button>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: language === 'en' ? '#fff' : 'transparent',
                  color: language === 'en' ? '#16a34a' : '#64748b',
                  boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main style={s.main}>

        {/* Hero Section Wrapper — full-height for scroll */}
        <section
          className="responsive-hero-section"
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            margin: '0 0 120px',
            position: 'relative'
          }}
        >
          {/* Glass Card — compact, content-driven height, raised from bottom */}
          <div
            className="responsive-hero-card"
            style={{
              padding: '22px 30px 18px',
              maxWidth: '410px',
              width: '100%',
              marginBottom: '20vh',
              background: 'rgba(10, 15, 30, 0.60)',
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(74, 222, 128, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              transform: 'translate(-50px, -75px)'
            }}
          >
            <h1 style={{ ...s.h1, display: 'flex', flexDirection: 'column', gap: '6px', margin: 0 }}>
              <span style={{ fontSize: 'clamp(26px, 3.6vw, 36px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1.5px', fontFamily: "'Inter', sans-serif", lineHeight: 0.95, textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}>
                {data.personalInfo.name}
              </span>
              <span style={{ fontSize: '11.5px', color: '#4ade80', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", opacity: 0.95 }}>
                {data.personalInfo.role}
              </span>
            </h1>
            <p style={{ ...s.subtitle, margin: '20px 0 0', fontSize: '13.5px', lineHeight: '1.6' }}>
              {data.personalInfo.bio}
            </p>
            <div style={{ ...s.btns, marginTop: '28px' }}>
              <a href="#projects" className="cta-button" style={{ ...s.btnPrimary, padding: '9px 20px', fontSize: '12.5px' }}>{data.hero.viewProjects} <IconArrow /></a>
              <a href="#contact" style={{ ...s.btnSecondary, padding: '9px 20px', fontSize: '12.5px' }}><IconMail /> {data.hero.contact}</a>
            </div>

            {/* Social Proof Hook */}
            <div style={{
              padding: '7px 10px',
              background: 'rgba(74, 222, 128, 0.04)',
              borderRadius: '10px',
              border: '1px solid rgba(74, 222, 128, 0.1)',
              fontSize: '10.5px',
              lineHeight: '1.45',
              color: '#a7f3d0',
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: '24px'
            }}>
              {language === 'es'
                ? '🚀 Proyecto de analítica de video en producción real.'
                : '🚀 Video & data analytics project active in production.'}
            </div>
          </div>

          {/* Premium Scroll Indicator */}
          <div style={{
            position: 'absolute',
            bottom: '2vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}>
            <a
              href="#projects"
              className="scroll-indicator"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: '#4ade80',
                opacity: 0.6,
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", color: '#a7f3d0', marginBottom: '6px' }}>
                {language === 'es' ? 'SCROLL' : 'Explore'}
              </span>
              <div className="scroll-arrow-wrapper">
                <IconChevronDown />
              </div>
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" style={{ paddingTop: 20, scrollMarginTop: '110px' }}>
          <p style={s.sectionTag}>{data.projectsSection.tag}</p>
          <h2 style={s.h2}>{data.projectsSection.title}</h2>

          {/* Project Tabs Selector */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
            {['Standalone', 'Research', 'Systems', 'Creative Coding'].map(tab => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: isActive ? '1px solid #16a34a' : '1px solid #e2e8f0',
                    background: isActive ? '#f0fdf4' : '#fff',
                    color: isActive ? '#15803d' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 2px 8px rgba(22, 163, 74, 0.08)' : 'none'
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {filteredProjects.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.15)', color: '#94a3b8', marginBottom: '24px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{data.projectsSection.emptyState}</p>
            </div>
          ) : (
            filteredProjects.map(p => (
              <div key={p.id} style={s.projectCard}>
                <div className="responsive-project-inner" style={s.projectInner}>
                  <div
                    className="responsive-project-img"
                    style={{ ...s.projectImg, cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => setLightbox({ images: p.images || [p.image || `/project-${p.id}.png`], index: 0 })}
                  >
                    <img
                      src={p.image || `/project-${p.id}.png`}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    />
                  </div>
                  <div style={s.projectContent}>
                    <span style={s.projectYear}>{p.year}</span>
                    <h3 style={s.projectTitle}>{p.title}</h3>
                    <p style={s.projectDesc}>{p.description}</p>
                    <div style={s.metric}><IconActivity /> {p.metric}</div>
                    <div style={s.tools}>
                      {p.tools.map(t => <span key={t} style={s.tool}>{t}</span>)}
                    </div>
                    {/* Repo / Deploy link buttons */}
                    {(p.repo || p.deploy) && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {p.repo && (
                          <a
                            href={p.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#cbd5e1', fontSize: 11, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#cbd5e1'; }}
                          >
                            <IconGithubSmall /> Repo
                          </a>
                        )}
                        {p.deploy && (
                          <a
                            href={p.deploy}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ade80', fontSize: 11, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74, 222, 128, 0.2)'; e.currentTarget.style.color = '#86efac'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74, 222, 128, 0.1)'; e.currentTarget.style.color = '#4ade80'; }}
                          >
                            <IconDeploy /> Deploy
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Blog (Bitácora) Section */}
        <section id="blog" style={{ paddingTop: 48, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 60, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', scrollMarginTop: '110px' }}>
          <p style={s.sectionTag}>{data.blogSection.tag}</p>
          <h2 style={{ ...s.h2, marginBottom: '24px' }}>{data.blogSection.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flex: 1 }}>
            {data.blogPosts.map(post => (
              <div
                key={post.id}
                style={{ ...s.card, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px', padding: '28px 30px' }}
                onClick={() => setActivePost(post)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div>
                  <p style={s.expPeriod}>{post.date} — {post.readTime}</p>
                  <h3 style={{ ...s.cardTitle, fontSize: '22px', margin: '8px 0 10px', transition: 'color 0.2s' }}>{post.title}</h3>
                  <p style={{ ...s.cardDesc, marginBottom: '12px', lineHeight: '1.6', fontSize: '13px' }}>{post.excerpt}</p>
                </div>
                <span style={{ color: '#4ade80', textDecoration: 'none', fontSize: '13px', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {language === 'es' ? 'Leer artículo' : 'Read post'} <IconArrow />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Skills */}
        <section id="about" className="responsive-grid2" style={{ ...s.grid2, scrollMarginTop: '110px' }}>
          <div>
            <p style={s.sectionTag}>{data.experienceSection.tag}</p>
            <h2 style={s.h2}>{data.experienceSection.title}</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={s.expCard}>
                <p style={s.expPeriod}>{exp.period}</p>
                <h4 style={s.expRole}>{exp.role}</h4>
                <p style={s.expCompany}>{exp.company}</p>
                <p style={s.expDesc}>{exp.description}</p>
              </div>
            ))}
          </div>
          <div>
            <p style={s.sectionTag}>{data.skillsSection.tag}</p>
            <h2 style={s.h2}>{data.skillsSection.title}</h2>
            
            {/* Mini Tabs Slider for groups (3 visible) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
              <button
                onClick={() => {
                  const newPage = skillsPage - 1;
                  setSkillsPage(newPage);
                  const targetIndex = newPage === 0 ? 0 : 2;
                  setActiveSkillGroup(data.skillsGroups[targetIndex].id);
                }}
                disabled={skillsPage === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: skillsPage === 0 ? 'rgba(255, 255, 255, 0.15)' : '#4ade80',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: skillsPage === 0 ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: skillsPage === 0 ? 0.35 : 1,
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  if (skillsPage !== 0) {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (skillsPage !== 0) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
              >
                <IconChevronLeft />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1, overflow: 'hidden' }}>
                {(skillsPage === 0 
                  ? data.skillsGroups.slice(0, 3) 
                  : skillsPage === 1 
                    ? data.skillsGroups.slice(2, 5) 
                    : data.skillsGroups.slice(4, 7)
                ).map(group => {
                  const isActive = activeSkillGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => setActiveSkillGroup(group.id)}
                      style={{
                        padding: '8px 10px',
                        background: isActive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isActive ? '1px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isActive ? '#4ade80' : '#cbd5e1',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        fontFamily: "'JetBrains Mono', monospace",
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '54px',
                        lineHeight: '1.3',
                        wordBreak: 'break-word'
                      }}
                      title={group.title}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = '#cbd5e1';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }
                      }}
                    >
                      {group.title}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  const newPage = skillsPage + 1;
                  setSkillsPage(newPage);
                  const targetIndex = newPage === 1 ? 2 : 4;
                  setActiveSkillGroup(data.skillsGroups[targetIndex].id);
                }}
                disabled={skillsPage === 2}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: skillsPage === 2 ? 'rgba(255, 255, 255, 0.15)' : '#4ade80',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: skillsPage === 2 ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: skillsPage === 2 ? 0.35 : 1,
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  if (skillsPage !== 2) {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (skillsPage !== 2) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
              >
                <IconChevronRight />
              </button>
            </div>

            {/* Pagination Indicator Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '22px' }}>
              {[0, 1, 2].map(pageIdx => {
                const isActive = skillsPage === pageIdx;
                return (
                  <button
                    key={pageIdx}
                    onClick={() => {
                      setSkillsPage(pageIdx);
                      const targetIndex = pageIdx === 0 ? 0 : pageIdx === 1 ? 2 : 4;
                      setActiveSkillGroup(data.skillsGroups[targetIndex].id);
                    }}
                    style={{
                      width: isActive ? '16px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 0 8px rgba(74, 222, 128, 0.5)' : 'none'
                    }}
                    title={`Página ${pageIdx + 1}`}
                  />
                );
              })}
            </div>

            {/* Group items display */}
            <div style={{ ...s.skillsWrap, minHeight: '120px', alignContent: 'flex-start', marginBottom: '24px' }}>
              {data.skillsGroups.find(g => g.id === activeSkillGroup)?.skills.map(sk => (
                <span 
                  key={activeSkillGroup + sk} 
                  style={{ 
                    ...s.skill, 
                    border: '1px solid rgba(74, 222, 128, 0.15)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    background: 'rgba(10, 15, 30, 0.6)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.4)';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.15)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>

            <div style={s.darkBox}>
              <div style={s.darkOrb} />
              <p style={s.darkTag}>{data.skillsSection.focusTag}</p>
              <h3 style={s.darkTitle}>{data.skillsSection.focusTitle}</h3>
              <p style={s.darkDesc}>{data.skillsSection.focusDesc}</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" style={{ ...s.contactSection, scrollMarginTop: '110px' }}>
          <p style={s.sectionTag}>{data.contactSection.tag}</p>
          <h2 style={s.contactH2}>{data.contactSection.title}</h2>
          <p style={s.contactP}>{data.contactSection.desc}</p>
          <div style={s.contactBtns}>
            <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ ...s.circleBtn, background: '#fff', color: '#181717' }}><IconGithub /></a>
            <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ ...s.circleBtn, background: '#0a66c2', borderColor: '#0a66c2', color: '#fff' }}><IconLinkedin /></a>
            <a href={data.personalInfo.twitter} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ ...s.circleBtn, background: '#000000', borderColor: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}><IconX /></a>
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => setShowEmailTooltip(true)}
              onMouseLeave={() => setShowEmailTooltip(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                height: 46,
                padding: '0 24px',
                borderRadius: 999,
                background: isCopied ? '#15803d' : '#16a34a',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                border: isCopied ? '1px solid #4ade80' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isCopied ? '0 0 15px rgba(74, 222, 128, 0.4)' : '0 4px 12px rgba(22, 163, 74, 0.3)',
                position: 'relative'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
            >
              {isCopied ? (
                <>
                  <IconCheck />
                  <span>{language === 'es' ? '¡Correo copiado!' : 'Email copied!'}</span>
                </>
              ) : (
                <>
                  <IconMail />
                  <span>{emailAddress || 'agostina.dev.dc@gmail.com'}</span>
                  <IconCopy />
                </>
              )}

              {/* Tooltip */}
              {showEmailTooltip && !isCopied && (
                <div style={{
                  position: 'absolute',
                  bottom: '125%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1e293b',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  pointerEvents: 'none',
                  zIndex: 10
                }}>
                  {language === 'es' ? 'Copiar al portapapeles' : 'Copy to clipboard'}
                </div>
              )}
            </button>
          </div>
          

          <div style={s.footer}>
            <p style={{ margin: 0 }}>© 2026 {data.personalInfo.name}. {data.contactSection.footerRights}</p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{data.contactSection.footerMadeIn} <span style={s.dot} /></p>
          </div>
        </section>

      </main>

      {/* Lightbox Modal Carousel */}
      {lightbox && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none'
          }}
          onClick={() => setLightbox(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 1010
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ✕
          </button>

          {/* Left Arrow */}
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }))
              }}
              style={{
                position: 'absolute',
                left: '28px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 1010
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              ‹
            </button>
          )}

          {/* Image display container */}
          <div
            style={{ maxWidth: '85%', maxHeight: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              alt={`View ${lightbox.index + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '12px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                objectFit: 'contain'
              }}
            />
            {/* Counter */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '1px'
            }}>
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </div>

          {/* Right Arrow */}
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }))
              }}
              style={{
                position: 'absolute',
                right: '28px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 1010
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              ›
            </button>
          )}
        </div>
      )}

      {/* Blog Post Reader Overlay */}
      {activePost && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 900,
            background: 'rgba(9, 15, 30, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            padding: '80px 24px'
          }}
          onClick={() => setActivePost(null)}
        >
          {/* Scroll progress bar */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 910
          }}>
            <div style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #4ade80, #22c55e)',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
            }} />
          </div>

          <div
            style={{
              maxWidth: '760px',
              width: '100%',
              height: 'fit-content',
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '48px 40px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px', marginBottom: '12px' }}>
              <button
                onClick={() => setActivePost(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
              >
                ← {language === 'es' ? 'Volver al portafolio' : 'Back to portfolio'}
              </button>
              <button
                onClick={() => setActivePost(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#cbd5e1' }}
              >
                ✕
              </button>
            </div>

            {/* Post Metadata */}
            <div>
              <p style={{ ...s.expPeriod, marginBottom: '8px' }}>
                {activePost.date} — {activePost.readTime}
              </p>
              <h1 style={{ ...s.h1, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: '1.2', margin: '8px 0 16px', textShadow: 'none' }}>
                {activePost.title}
              </h1>
            </div>

            {/* Post Body Content */}
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '32px' }}>
              {activePost.content ? (
                activePost.content.map((paragraph, index) => {
                  if (paragraph === '__IMAGE__') {
                    return (
                      <div key={index} style={{ margin: '40px 0', textAlign: 'center' }}>
                        <img
                          src={activePost.image || '/blog/vennD.png'}
                          alt="Venn Diagram"
                          style={{
                            maxWidth: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.25)',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            maxHeight: '420px',
                            objectFit: 'contain',
                            background: '#0f172a',
                            padding: '16px'
                          }}
                        />
                        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace" }}>
                          {language === 'es' ? 'La convergencia de habilidades en Finanzas Cuantitativas' : 'The convergence of skills in Quantitative Finance'}
                        </p>
                      </div>
                    )
                  }

                  if (paragraph.startsWith('__IMAGE_PATH:')) {
                    const parts = paragraph.replace('__IMAGE_PATH:', '').split('|');
                    const imgPath = parts[0];
                    const caption = parts[1] || '';
                    return (
                      <div key={index} style={{ margin: '40px 0', textAlign: 'center' }}>
                        <img
                          src={imgPath}
                          alt={caption}
                          style={{
                            maxWidth: '100%',
                            borderRadius: '16px',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.25)',
                            border: '1px solid rgba(74, 222, 128, 0.3)',
                            maxHeight: '420px',
                            objectFit: 'contain',
                            background: '#0f172a',
                            padding: '16px'
                          }}
                        />
                        {caption && (
                          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace" }}>
                            {caption}
                          </p>
                        )}
                      </div>
                    )
                  }
                  const isNpuPost = activePost.id === 4 || activePost.title.toLowerCase().includes('npu');
                  const isNpuTriggerParagraph = isNpuPost && (
                    paragraph === "Ahora incluso aparecen PCs de consumo con NPUs integradas como un componente más del sistema." || 
                    paragraph === "Now even consumer PCs appear with integrated NPUs as just another system component."
                  );

                  const isHeading = paragraph.startsWith('### ') || 
                    paragraph === 'El problema del “mismo score, distinto modelo”' ||
                    paragraph === 'The "same score, different model" problem' ||
                    paragraph === 'Esto no es solo intuición' ||
                    paragraph === 'This is not just intuition' ||
                    paragraph === 'Más allá del fenómeno empírico: qué significa “estimabilidad”' ||
                    paragraph === 'Beyond the empirical phenomenon: what does "estimability" mean?' ||
                    paragraph === 'Dos perspectivas sobre el mismo problema' ||
                    paragraph === 'Two perspectives on the same problem' ||
                    paragraph === 'Entonces, ¿qué estamos midiendo realmente?' ||
                    paragraph === 'So, what are we really measuring?' ||
                    paragraph === 'Cierre' ||
                    paragraph === 'Closing';

                  if (isHeading) {
                    const cleanHeading = paragraph.startsWith('### ') ? paragraph.slice(4) : paragraph;
                    const isAucHeading = paragraph === 'El problema del “mismo score, distinto modelo”' ||
                                         paragraph === 'The "same score, different model" problem';
                    const isRagHeading = cleanHeading === 'El retriever como verdadero cuello de botella' ||
                                         cleanHeading === 'The retriever as the true bottleneck';
                    return (
                      <React.Fragment key={index}>
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#4ade80',
                            marginTop: '36px',
                            marginBottom: '16px',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {cleanHeading}
                        </h3>
                        {isAucHeading && (
                          <div style={{ margin: '30px 0', textAlign: 'center' }}>
                            <img
                              src="/blog/auc_posteo.png"
                              alt="AUC Comparison"
                              style={{
                                maxWidth: '100%',
                                borderRadius: '16px',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.25)',
                                border: '1px solid rgba(74, 222, 128, 0.3)',
                                maxHeight: '420px',
                                objectFit: 'contain',
                                background: '#0f172a',
                                padding: '16px'
                              }}
                            />
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace" }}>
                              {language === 'es' ? 'Modelos con igual AUC de 0.85 pero distinta estabilidad' : 'Models with same 0.85 AUC but different stability'}
                            </p>
                          </div>
                        )}
                        {isRagHeading && (
                          <div style={{ margin: '30px 0', textAlign: 'center' }}>
                            <img
                              src="/blog/rag_posteo.png"
                              alt="RAG Architecture"
                              style={{
                                maxWidth: '100%',
                                borderRadius: '16px',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.25)',
                                border: '1px solid rgba(74, 222, 128, 0.3)',
                                maxHeight: '420px',
                                objectFit: 'contain',
                                background: '#0f172a',
                                padding: '16px'
                              }}
                            />
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace" }}>
                              {language === 'es' ? 'El flujo de recuperación en sistemas RAG híbridos' : 'The retrieval flow in hybrid RAG systems'}
                            </p>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  const isBullet = paragraph.startsWith('- ') || paragraph.startsWith('• ');

                  const formatText = (text) => {
                    if (!text) return text;
                    const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
                    const parts = text.split(tokenRegex);
                    return parts.map((part, idx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={idx} style={{ color: '#4ade80', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                      } else if (part.startsWith('[') && part.includes('](')) {
                        const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(part);
                        if (linkMatch) {
                          const [, linkText, url] = linkMatch;
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#4ade80', textDecoration: 'underline', fontWeight: 650 }}
                            >
                              {linkText}
                            </a>
                          );
                        }
                      }
                      return part;
                    });
                  };

                  if (isBullet) {
                    const cleanBullet = paragraph.slice(2);
                    return (
                      <li
                        key={index}
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.85',
                          color: '#cbd5e1',
                          marginLeft: '24px',
                          marginBottom: '12px',
                          fontFamily: "'JetBrains Mono', monospace"
                        }}
                      >
                        {formatText(cleanBullet)}
                      </li>
                    );
                  }

                  return (
                    <React.Fragment key={index}>
                      <p
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.85',
                          color: '#cbd5e1',
                          marginBottom: '24px',
                          whiteSpace: 'pre-line',
                          fontFamily: "'JetBrains Mono', monospace"
                        }}
                      >
                        {formatText(paragraph)}
                      </p>
                      {isNpuTriggerParagraph && (
                        <div style={{ margin: '40px 0', textAlign: 'center' }}>
                          <img
                            src="/blog/npu.png"
                            alt="NPU"
                            style={{
                              maxWidth: '100%',
                              borderRadius: '16px',
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(74, 222, 128, 0.25)',
                              border: '1px solid rgba(74, 222, 128, 0.3)',
                              maxHeight: '420px',
                              objectFit: 'contain',
                              background: '#0f172a',
                              padding: '16px'
                            }}
                          />
                          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace" }}>
                            {language === 'es' ? 'Hardware dedicado para acelerar inferencia local' : 'Dedicated hardware to accelerate local inference'}
                          </p>
                        </div>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1' }}>{activePost.excerpt}</p>
              )}
            </div>

            {/* Next / Prev Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '16px' }}>
              {(() => {
                const currentIndex = data.blogPosts.findIndex(p => p.id === activePost.id)
                const prevPost = currentIndex > 0 ? data.blogPosts[currentIndex - 1] : null
                const nextPost = currentIndex < data.blogPosts.length - 1 ? data.blogPosts[currentIndex + 1] : null

                return (
                  <>
                    <div>
                      {prevPost && (
                        <button
                          onClick={() => {
                            // Find corresponding post in current data language array
                            setActivePost(prevPost)
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            maxWidth: '280px'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)'; e.currentTarget.style.background = 'rgba(74, 222, 128, 0.03)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)' }}
                        >
                          <span style={{ fontSize: '11px', color: '#86efac', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                            ← {language === 'es' ? 'Anterior' : 'Previous'}
                          </span>
                          <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '240px', fontFamily: "'JetBrains Mono', monospace" }}>
                            {prevPost.title}
                          </span>
                        </button>
                      )}
                    </div>
                    <div>
                      {nextPost && (
                        <button
                          onClick={() => {
                            setActivePost(nextPost)
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            padding: '12px 18px',
                            textAlign: 'right',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '4px',
                            maxWidth: '280px'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.3)'; e.currentTarget.style.background = 'rgba(74, 222, 128, 0.03)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)' }}
                        >
                          <span style={{ fontSize: '11px', color: '#86efac', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                            {language === 'es' ? 'Siguiente' : 'Next'} →
                          </span>
                          <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '240px', fontFamily: "'JetBrains Mono', monospace" }}>
                            {nextPost.title}
                          </span>
                        </button>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default App
