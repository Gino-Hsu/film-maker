import { useEffect, useRef, useState } from 'react';
import { useMouseMove, useWindowSize } from '@/utils/customHooks';
import styles from './HorizontalCards.module.scss';

const photos = [
  {
    id: 1,
    photoSrc: '/photo1.png',
  },
  {
    id: 2,
    photoSrc: '/photo2.png',
  },
  {
    id: 3,
    photoSrc: '/photo3.png',
  },
  {
    id: 4,
    photoSrc: '/photo1.png',
  },
  {
    id: 5,
    photoSrc: '/photo2.png',
  },
];

export default function Photos() {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [mainContainerHeight, setMainContainerHeight] = useState();
  const [scrollContainerHeight, setScrollContainerHeight] = useState();
  const mainContainerElement = useRef();
  const photoContainerElement = useRef();
  const photoElements = useRef();
  const mouseInPhotos = useRef(true);

  const handleOnScroll = () => {
    const scrollValue = photoElements.current?.offsetTop;
    const photoWidth = photoContainerElement.current?.offsetWidth;
    const windowWidth = window.innerWidth;

    document.documentElement.style.overflowY = 'hidden';
    if (scrollValue === 0) {
      setScrollLeft(scrollValue);
      document.documentElement.style.overflowY = 'auto';
    } else if (scrollValue >= photoWidth - windowWidth) {
      setScrollLeft(photoWidth - windowWidth);
    } else {
      setScrollLeft(scrollValue);
    }
  };

  const handleMouseMove = e => {
    const mousePosition = e.clientY;
    const photoPositionTop = mainContainerElement.current?.offsetTop;
    const windowPosition = window.scrollY;

    if (mousePosition + windowPosition > photoPositionTop) {
      if (mouseInPhotos.current) {
        window.scrollTo(0, mainContainerElement.current.offsetTop);
        setTimeout(() => {
          document.documentElement.style.overflowY = 'hidden';
        }, 500);
      }
      mouseInPhotos.current = false;
    } else {
      document.documentElement.style.overflowY = 'auto';
      mouseInPhotos.current = true;
    }
  };

  const setStatefunc = () => {
    setMainContainerHeight(photoElements.current.clientHeight);
    setScrollContainerHeight(photoContainerElement.current.offsetWidth);
  };

  useEffect(() => {
    if (photoElements.current && photoContainerElement.current) {
      setStatefunc();
    }
  }, [photoElements.current, photoContainerElement.current]);

  useMouseMove(handleMouseMove);
  useWindowSize(setStatefunc);

  return (
    <div
      onScroll={handleOnScroll}
      className={styles.main__container}
      ref={mainContainerElement}
      style={{ height: `${mainContainerHeight}px` }}
    >
      <div
        className={styles.scroll__container}
        ref={photoContainerElement}
        style={{
          height: `${scrollContainerHeight}px`,
          transform: `translate(${-scrollLeft}px, 0)`,
        }}
      >
        <div className={styles.photos} ref={photoElements}>
          {photos.map(photo => (
            <div key={photo.id} className={styles.photo}>
              <img src={photo.photoSrc} alt={`圖片${photo.id}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
