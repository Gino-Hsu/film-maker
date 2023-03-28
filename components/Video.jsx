const videoSrc = '/video.mp4';

export default function Video(props) {
  return (
    <>
      <video
        width='100%'
        // 設定靜音，瀏覽器才不會阻擋自動播放
        muted={true}
        loop='loop'
        autoPlay='autoplay'
        ref={props.videoRef}
      >
        <source src={videoSrc} />
        <a href={videoSrc} />
      </video>
    </>
  );
}
