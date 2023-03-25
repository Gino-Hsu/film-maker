import { useState } from 'react';
import styles from './Cards.module.scss';

const cardsSrc = {
  cardOne: '/card1.png',
  cardTwo: '/card2.png',
};

export default function Cards() {
  const [showedCard, setShowedCard] = useState('init');

  const handleShowed = () => {
    if (showedCard !== 'left') {
      setShowedCard('left');
    } else {
      setShowedCard('right');
    }
  };

  return (
    <div className={styles.cards}>
      <div className={styles.left__container}>
        <div
          className={
            showedCard === 'left'
              ? styles.animated__up
              : showedCard === 'right'
              ? styles.animated__down
              : ''
          }
          onClick={() => handleShowed('left')}
        >
          <img className={styles.image} src={cardsSrc.cardOne} alt='卡片1' />
        </div>
      </div>
      <div className={styles.right__container}>
        <div
          className={
            showedCard === 'right'
              ? styles.animated__up
              : showedCard === 'left'
              ? styles.animated__down
              : ''
          }
          onClick={() => handleShowed('right')}
        >
          <img className={styles.image} src={cardsSrc.cardTwo} alt='卡片2' />
        </div>
      </div>
    </div>
  );
}
