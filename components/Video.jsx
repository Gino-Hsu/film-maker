import { useEffect, useRef } from 'react';

const videoSrc = '/video.mp4';

export default function Video() {
  const videoEle = useRef();

  useEffect(() => {
    let observer = new IntersectionObserver(
      // callback function
      entries => {
        entries.forEach(entry => {
          // 開始撥放的閾值為 0.3
          const playThreshold = 0.3;
          const video = entry.target;
          // 取得影片元素的高度
          const videoHeight = video.offsetHeight;
          // 取得可視區域的高度
          const visibleHeight = entry.intersectionRect.height;
          // 計算可視區域的高度佔影片元素高度的百分比
          const visiblePercent = visibleHeight / videoHeight;
          // 如果目標元素進入了可視區域
          if (entry.isIntersecting) {
            // 如果可視區域的高度佔影片元素高度的百分比小於閾值，暫停影片播放
            if (visiblePercent < playThreshold) {
              video.pause();
            } else {
              // 如果可視區域的高度佔影片元素高度的百分比大於等於閾值，播放影片
              video.play();
            }
          } else {
            // 如果目標元素不在可視區域內，將影片暫停以及播放時間設為 0
            video.pause();
            entry.target.currentTime = 0;
          }
        });
      },
      {
        root: null, // 設定為預設的根元素
        rootMargin: '0px', // 設定為預設值
        threshold: [0, 0.3], // 設定觸發回調的閾值為 0 和 0.3
      }
    );

    // 觀察影片元素
    observer.observe(videoEle.current);

    return () => {
      observer.unobserve(videoEle.current);
    };
  }, []);

  return (
    <>
      <video width='100%' muted={true} loop='loop' ref={videoEle}>
        <source src={videoSrc} />
        <a href={videoSrc} />
      </video>
    </>
  );
}
