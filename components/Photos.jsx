import { useState } from 'react';
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

export default function Photos() {
  const [scrollLeft, setScrollLeft] = useState(0);

  console.log(scrollLeft);
  const handleOnWheel = e => {
    e.stopPropagation();
    const value = e.deltaY;
    setScrollLeft(pre => pre - value);
  };

  return (
    <div
      className={styles.photos}
      onWheel={e => handleOnWheel(e)}
      style={{ left: scrollLeft }}
    >
      {photos.map(photo => (
        <div key={photo.id} className={styles.container}>
          <img src={photo.photoSrc} alt={`圖片${photo.id}`} />
        </div>
      ))}
    </div>
  );
}
