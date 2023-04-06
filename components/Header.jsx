import { useState } from 'react';
import { useWindowScroll } from '@/utils/customHooks';
import styles from './Header.module.scss';

export default function Header() {
  const [headerShowed, setHeaderShowed] = useState(true);

  const handleScroll = () => {
    const windowScrollY = window.scrollY;

    if (windowScrollY > 300) {
      setHeaderShowed(false);
    } else {
      setHeaderShowed(true);
    }
  };
  useWindowScroll(handleScroll);

  return (
    <div
      className={
        headerShowed ? styles.headerDisplay : styles.headerDisplay__hidden
      }
    >
      <div className={styles.header}>
        <h1 className={styles.header__title}>Film Maker</h1>
      </div>
    </div>
  );
}
