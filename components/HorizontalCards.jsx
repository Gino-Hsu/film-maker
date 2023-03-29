import { useEffect, useRef, useState } from 'react';
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

export default function Photos(props) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const photoContainerElement = useRef();
  const photoElement = useRef();

  const handleOnScroll = () => {
    const scrollValue = photoElement.current?.offsetTop;
    const photoWidth = photoContainerElement.current?.offsetWidth;
    const windowWidth = window.innerWidth;
    // 停止瀏覽器 scrolling
    document.documentElement.style.overflowY = 'hidden';

    if (scrollValue === 0) {
      setScrollLeft(0);
      document.documentElement.style.overflowY = 'auto';
    } else if (scrollValue >= photoWidth - windowWidth) {
      setScrollLeft(photoWidth - windowWidth);
    } else {
      setScrollLeft(scrollValue);
    }
  };

  useEffect(() => {
    if (scrollLeft > 0) {
      // 確保元素位於視窗內
      window.scrollTo(0, props.photosRef.current.offsetTop);
    }
  }, [scrollLeft]);

  return (
    <div
      className={styles.photos}
      onScroll={e => handleOnScroll(e)}
      ref={props.photosRef}
      style={{ height: photoElement.current?.clientHeight }}
    >
      <div
        className={styles.scroll__container}
        ref={photoContainerElement}
        style={{
          height: photoContainerElement.current?.offsetWidth,
          transform: `translate(${-scrollLeft}px, 0)`,
        }}
      >
        {photos.map(photo => (
          <div key={photo.id} className={styles.container} ref={photoElement}>
            <img src={photo.photoSrc} alt={`圖片${photo.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
