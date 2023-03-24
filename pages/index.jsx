import { useState, useEffect } from 'react';
import Head from 'next/head';

import Header from '../components/Header';

import styles from '@/styles/Home.module.scss';

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    // window.scrollY 垂直滾動的 pix，用 setState 存起來
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    // 掛載監聽器，監聽 window 的滾動事件
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Film maker</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div
          className={
            // 當垂直滾動超過300px時，header隱藏起來
            scrollPosition > 300
              ? styles.headerDisplay__hidden
              : styles.headerDisplay
          }
        >
          <Header />
        </div>
        <section className={styles.cards}>122</section>
      </main>
    </>
  );
}
