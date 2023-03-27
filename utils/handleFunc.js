export function handleHeaderShowed(winPosition, setState) {
  if (winPosition > 300) {
    setState(false);
  } else {
    setState(true);
  }
}

export function handleVideoPlay(
  videoRef,
  videoHeight,
  videoPositionTop,
  winHeight,
  winPosition
) {
  // 影片播放的範圍
  const videoPlayScope =
    winHeight - (videoPositionTop - winPosition) > videoHeight * 0.3 &&
    winPosition - videoPositionTop < videoHeight * 0.7;
  // 影片時間重置為 0 的範圍
  const videoResetScope =
    winPosition - (videoPositionTop + videoHeight) > 0 ||
    winPosition + winHeight - videoPositionTop < 0;

  if (videoPlayScope) {
    videoRef.play();
  } else {
    videoRef.pause();
  }

  if (videoResetScope) {
    videoRef.pause();
    videoRef.currentTime = 0;
  }
}
