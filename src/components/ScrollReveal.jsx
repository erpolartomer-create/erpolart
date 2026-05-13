import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollReveal = ({ children, direction = 'up', delay = 0, className = '', stagger = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const getVariants = () => {
    switch (direction) {
      case 'left':
        return { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      case 'right':
        return { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } };
      case 'up':
      default:
        return { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    }
  };

  const variants = getVariants();

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay,
            },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
