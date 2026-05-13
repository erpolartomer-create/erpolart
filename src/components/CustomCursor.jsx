import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(0, springConfig);
  const cursorYSpring = useSpring(0, springConfig);

  useEffect(() => {
    // Hidden on touch devices
    if ('ontouchstart' in window) {
      setHidden(true);
      return;
    }

    const mouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      cursorXSpring.set(e.clientX - 16);
      cursorYSpring.set(e.clientY - 16);
    };

    const mouseDown = () => setClicked(true);
    const mouseUp = () => setClicked(false);
    
    // Hide cursor when leaving window
    const mouseLeave = () => setHidden(true);
    const mouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    document.addEventListener('mouseleave', mouseLeave);
    document.addEventListener('mouseenter', mouseEnter);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mouseleave', mouseLeave);
      document.removeEventListener('mouseenter', mouseEnter);
    };
  }, [cursorXSpring, cursorYSpring]);

  if (hidden) return null;

  return (
    <>
      {/* Inner Dot */}
      <div 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
        }}
      />
      {/* Outer Ring */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-gray-400 rounded-full pointer-events-none z-[99] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: clicked ? 0.8 : 1,
        }}
        animate={{
          scale: clicked ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      />
    </>
  );
};

export default CustomCursor;
