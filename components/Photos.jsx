import { useEffect, useRef, useState } from 'react';
import styles from './Photos.module.scss';

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
  const PhotoContainerElement = useRef();

  const handleOnWheel = e => {
    const value = e.deltaY;
    const windowWidth = window.innerWidth;
    const photoWidth = PhotoContainerElement.current.offsetWidth;

    document.documentElement.style.overflowY = 'hidden';

    setScrollLeft(pre => {
      const scrollValue = pre + value;

      if (scrollValue < 0) {
        document.documentElement.style.overflowY = 'auto';
        return 0;
      } else if (scrollValue > photoWidth - windowWidth) {
        return photoWidth - windowWidth;
      } else {
        return pre + value;
      }
    });
  };

  useEffect(() => {
    if (scrollLeft > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    props.photosRef.current.scrollTo(scrollLeft, 0);
  }, [scrollLeft]);

  return (
    <div
      className={styles.photos}
      onWheel={e => handleOnWheel(e)}
      ref={props.photosRef}
    >
      <div className={styles.scroll__container} ref={PhotoContainerElement}>
        {photos.map(photo => (
          <div key={photo.id} className={styles.container}>
            <img src={photo.photoSrc} alt={`圖片${photo.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
