import { useEffect } from 'react';

export const useWindowScroll = callback => {
  useEffect(() => {
    window.addEventListener('scroll', callback);
    return () => window.removeEventListener('scroll', callback);
  }, []);
};

export const useWindowSize = callback => {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, [callback]);
};

export const useMouseMove = callback => {
  useEffect(() => {
    window.addEventListener('mousemove', callback);
    return () => window.removeEventListener('mousemove', callback);
  }, [callback]);
};
