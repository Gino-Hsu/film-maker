## 規格說明

- Header：往下滑動時 (scrollTop > 300px) 隱藏 Header，滾輪向上捲動時顯示 Header，隱藏及顯示的過程有 transition 效果。
- Cards Shuffle Block：卡片切換的特效，引用透視視角確保視覺往真實視角逼近。
- Effective video block：entry ratio 大於 30% 後播放影片，小於時暫停播放。當 invisible 時，主動將播放進度 reset 回 time = 0。
- Horizontal Block：該區當滑鼠進入後，scrolling 的效果是讓元素橫向移動來閱覽橫向擴展的內容。

## 工具

- Next.js v13.2.4
- React.js v18.2.0
- Sass v1.60.0

## 實作方法

### Header

![gif](./public/gifHeader.gif)

- 利用 React Hook：useState，控制 Header 隱藏/顯示，boolean(true：顯示 / false：隱藏)。

```javascript
const [headerShowed, setHeaderShowed] = useState(true);
```

- className= {styles.headerDisplay} 或 {styles.headerDisplay\_\_hidden} 在畫面上呈現顯示或隱藏的效果。

```javascript
<div
  className={headerShowed ? styles.headerDisplay : styles.headerDisplay__hidden}
>
  <Header />
</div>
```

- 控制邏輯：在 useEffect 中掛載監聽器，監聽 window 的 scroll 事件，當觸發執行 handleFunc。

```javascript
useEffect(() => {
   window.addEventListener('scroll', handleScroll);

   <!-- cleanUp function 避免監聽器重複掛載 -->
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
}, [])
```

- windowPosition = window.scrollY 畫面垂直滾動的值，當 > 300 setState(false)，反之 setState(true)。

```javascript
function handleHeaderShowed(winPosition, setState) {
  if (winPosition > 300) {
    setState(false);
  } else {
    setState(true);
  }
}
```

---

### Cards Shuffle Block

![gif](./public/gifShuffle.gif)

- 利用 React Hook：useState，控制左邊卡片在上或右邊卡片在上，string('left'：左邊卡片在上，'right'：右邊卡片在上)，因不希望專案初始化就呈現動畫效果，所以 state 的初始值設定 'init' (無切換的動畫效果)

```javascript
const [showedCard, setShowedCard] = useState('init');
```

- 在單一卡片上掛載 onClick 事件，並執行 handleShowed 的 eventHandler，handleShowed 中當 showedCard 不等於 'left' 時 setState('left')，反之 setState('right')。

```javascript
const handleShowed = () => {
  if (showedCard !== 'left') {
    setShowedCard('left');
  } else {
    setShowedCard('right');
  }
};
```

- 利用 state 改變 className，結合 css-animation 呈現動畫效果，以左邊卡片為例：

```javascript
<div
  className={
    showedCard === 'left'
      ? styles.animated__up
      : showedCard === 'right'
      ? styles.animated__down
      : ''
  }
  onClick={handleShowed}
>
  ...
</div>
```

---

### Effective video block

![gif](./public/gifVideo.gif)

首先思考使用者做了甚麼而會影響影片的撥放、暫停和 reset 時間為 0，考量到當畫面 scrolling 和 resize 時會影響 video 於畫面上的位置。

- useEffect 裡 window.addEventListener 包含 'scroll' 和 'resize'。

```javascript
 useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleSize);

  <!-- cleanUp function 避免監聽器重複掛載 -->
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleSize);
  }
 }, [])
```

- handleScroll 和 handleSize 函式裡的 handleVideoPlay 函式為控制影片播放、暫停和 reset 的控制。

```javascript
function handleVideoPlay(...) {
<!-- 影片播放的範圍 -->
  const videoPlayScope =
    winHeight - (videoPositionTop - winPosition) > videoHeight * 0.3 &&
    winPosition - videoPositionTop < videoHeight * 0.7;

<!-- 影片時間重置為 0 的範圍 -->
  const videoResetScope =
    winPosition - (videoPositionTop + videoHeight) > 0 ||
    winPosition + winHeight - videoPositionTop < 0;

}

---
winHeight = window.innerHeight // 瀏覽器可視區的高度
winPosition = window.scrollY // 瀏覽器滾動的垂直距離，作為當前視窗頂部的位置
videoHeight = videoElement.current.clientHeight // video 元素的高度
videoPositionTop = videoElement.current.offsetTop // video 元素的位置

播放條件：
// video 由下方進入視窗，當進入的高度 > 整個元素高度的 30% 則開始播放
winHeight - (videoPositionTop - winPosition) > videoHeight * 0.3

// video 由上方進入視窗，視窗範圍的元素高度隨著進入縮小，當 < 整個元素高度的 70% 則開始播放
winPosition - videoPositionTop < videoHeight * 0.7

reset條件：
// video 由下方離開視窗
winPosition - (videoPositionTop + videoHeight) > 0

// video 由上方離開視窗
winPosition + winHeight - videoPositionTop < 0
```

- 條件判斷控制 video 行為

```javascript
function handleVideoPlay(...) {
  ...
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
```

---

### Horizontal Block

![gif](./public/gifHorizontal.gif)

- 只有當鼠進入後，scrolling 才會使元素橫向移動，useEffect 設置監聽事件 'moseove'，監聽滑鼠移動的事件。

```javascript
useEffect(() => {
  ...
  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    ...
    window.removeEventListener('mousemove', handleMouseMove);
  }
},[])
```

- 為了確保滑鼠進入後，整個元素在視窗內(使用者不會有看不到內容的情形)，滑鼠是否進入元素內了，如果有 element.scrollIntoView()。

```javascript
 const handleMouseMove = e => {
  ...
  if (mousePosition + windowPosition > photoPositionTop) {
    photosElement.current.scrollIntoView({
        behavior: 'smooth',
    });
  } else {
    ...
  }
}
```

- 元素橫向移動，先在元素上掛載 'onWheel' 事件，當滑鼠在元素內滾動滾輪時執行 handleOnWheel。

```javascript
<div
  className={styles.photos}
  onWheel={e => handleOnWheel(e)}
  ref={props.photosRef}
>
  ...
</div>
```

- 利用 React Hook：useState 紀錄滾輪滾動的值，並作為元素橫移的量。

```javascript
const [scrollLeft, setScrollLeft] = useState(0);
...
const handleOnWheel = e => {
  const value = e.deltaY; // 滾輪滾動的值，向下滾動為正值，向上滾動為負值
  ...

  setScrollLeft(pre => {
    // 前一次 state 的值 + 滾輪滾動的值，為元素移動的值 scrollValue
    const scrollValue = pre + value;
    ...
    if (scrollValue < 0) {
      ...

      // 當 scrollValue < 0 已經向上滾動滾動超出元素的起始範圍，所以 setState(0)
      return 0;
    } else if (scrollValue > photoWidth - windowWidth) {

      // 當 scrollValue > photoWidth - windowWidth 已經向下滾動滾動超出元素的尾部範圍，所以只要對元素超出視窗的範圍做 setState，setState(photoWidth - windowWidth)
      return photoWidth - windowWidth;
    } else {
      return pre + value;
    }
  });
}
```

- 優化，為了不讓元素橫向移動的過程，視窗也跟著上下移動，在特定地方加入 document.documentElement.style.overflowY = 'hidden' 移除瀏覽器的 scroll，document.documentElement.style.overflowY = 'auto' 恢復瀏覽器的 scroll。
