import { useState } from 'react';
import styles from './ShuffleCards.module.scss';

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

  const changeStyle = value => {
    if (value === 'left') {
      if (showedCard === 'left') {
        return styles.animated__up;
      } else if (showedCard === 'right') {
        return styles.animated__down;
      }
    }

    if (value === 'right') {
      if (showedCard === 'right') {
        return styles.animated__up;
      } else if (showedCard === 'left') {
        return styles.animated__down;
      }
    }
  };

  return (
    <div className={styles.cards}>
      <div
        className={`
          ${styles.left__container}
          ${showedCard === 'left' && styles['index__up']}
        `}
        onClick={handleShowed}
      >
        <div className={changeStyle('left')}>
          <img className={styles.image} src={cardsSrc.cardOne} alt='卡片1' />
        </div>
      </div>
      <div
        className={`
          ${styles.right__container}
          ${showedCard === 'left' && styles['index__down']}
        `}
        onClick={handleShowed}
      >
        <div className={changeStyle('right')}>
          <img className={styles.image} src={cardsSrc.cardTwo} alt='卡片2' />
        </div>
      </div>
    </div>
  );
}
