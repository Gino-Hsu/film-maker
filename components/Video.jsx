const videoSrc = '/video.mp4';

export default function Video(props) {
  return (
    <>
      <video width='100%' loop='loop' autoPlay='autoplay' ref={props.videoRef}>
        <source src={videoSrc} />
        <a href={videoSrc} />
      </video>
    </>
  );
}
