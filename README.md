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

### 建立 Custom Hooks

- 包裝 window 掛載監聽事件的函式。
- 統一以 use... 作為命名的開頭，包含 scroll 事件：useWindowScroll、resize 事件：useWindowSize 及 mousemove 事件：useMouseMove。
- 在需要使用的 component 中載入使用。

```javascript
// customHooks.jsx
import { useEffect } from 'react';

export const useWindowScroll = callback => {
  useEffect(() => {
    window.addEventListener('scroll', callback);
    return () => window.removeEventListener('scroll', callback);
  }, [callback]);
};

export const useWindowSize = callback => {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, [callback]);
};

export const useMouseMove = callback => {
  useEffect(() => {
    window.addEventListener('mousemove', callback);
    return () => window.removeEventListener('mousemove', callback);
  }, [callback]);
};
```

Thinking：一開始思考方式為在 index.jsx (Home page) 中的 useEffect 掛載監聽事件，然後相關的 state 也放在 index.jsx 中，此作法會造成所有的子 component 做非必要的 re-renderr，所以自定義 custom hooks，將掛載 window 監聽事件的函示包裝後，在需要用到的子 component 中再載入使用。

---

### Header

![gif](./public/gifHeader.gif)

- 利用 React Hook：useState，控制 Header 隱藏/顯示，boolean(true：顯示 / false：隱藏)。

```javascript
// Header.jsx
const [headerShowed, setHeaderShowed] = useState(true);
```

- className= {styles.headerDisplay} 或 {styles.headerDisplay\_\_hidden} 在畫面上呈現顯示或隱藏的效果。

```Html
// Header.jsx
<div
  className={headerShowed ? styles.headerDisplay : styles.headerDisplay__hidden}
></div>
```

- 載入 window scroll 事件的 custom hook (useWindowScroll)。
- handleScroll 函式做為 useWindowScroll 的 callback func.，進行 header 顯示/隱藏的邏輯控制。
- windowScrollY = window.scrollY 畫面垂直滾動的值，當 > 300 setHeaderShowed(false)，反之 setHeaderShowed(true)。

```javascript
// Header.jsx

// 載入 useWindowScroll custom hook
import { useWindowScroll } from '@/utils/customHooks'

export default function Header() {
  ...
  // useWindowScroll 的 callback function，當 windowScrollY > 300 header 隱藏，其餘 header 顯示
  const handleScroll = () => {
    const windowScrollY = window.scrollY;

    if (windowScrollY > 300) {
      setHeaderShowed(false);
    } else {
      setHeaderShowed(true);
    }
  };
  // 使用 useWindowScroll custom hook
  useWindowScroll(handleScroll);
  ...
}
```

---

### Cards Shuffle Block

![gif](./public/gifShuffle.gif)

- 利用 React Hook：useState，控制左邊卡片在上或右邊卡片在上，string('left'：左邊卡片在上，'right'：右邊卡片在上)，因不希望專案初始化就呈現動畫效果，所以 state 的初始值設定 'init' (無切換的動畫效果)

```javascript
// ShuffleCards.jsx
const [showedCard, setShowedCard] = useState('init');
```

- 在單一卡片上掛載 onClick 事件，並執行 handleShowed 的 eventHandler，handleShowed 中當 showedCard 不等於 'left' 時 setState('left')，反之 setState('right')。

```javascript
// ShuffleCards.jsx
const handleShowed = () => {
  if (showedCard !== 'left') {
    setShowedCard('left');
  } else {
    setShowedCard('right');
  }
};
```

- 利用 state 改變 className，結合 css-animation 呈現動畫效果

```javascript
// ShuffleCards.jsx
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
```

---

### Effective video block

![gif](./public/gifVideo.gif)

- 以 useRef hook，存取 video 元素。
- 使用 Intersection Observer API，實作 video 元素與瀏覽器的觀測，root: null 和 rootMargin: '0px' 的範圍為瀏覽器的可視區。
- 閥值包括 threshold: 0：元素進入/離開瀏覽器的可視區、threshold: 0.3：元素總高度的 30% 進入/離開瀏覽器的可視區。

```javascript
// Video.jsx
...
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
...
```

Thinking：原先思考使用者做了甚麼而會影響影片的撥放、暫停和 reset 時間為 0，計算瀏覽器可視區頂部與元素的相對位置，當畫面 scrolling 和 resize 時會影響 video 於畫面上的位置，直至瞭解 Intersection Observer API 後覺得此方法相對複雜且程式碼難以閱讀。
Intersection Observer API：https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

---

### Horizontal Block

![gif](./public/gifHorizontal.gif)

- 實作當滑鼠進入元素時，才會有 horizontal 的功能，載入 useMouseMove custom hook。
- handleMouseMove 為 useMouseMove 的 callback func.，用以判斷滑鼠是否進入目標元素，並控制使用者可以看到完整的目標元素和瀏覽器 scroll 行為的禁止/開啟。

```javascript
// HorizontalCards.jsx
export default function Photos() {
  ...
  const handleMouseMove = e => {
    // 滑鼠的垂直座標
    const mousePosition = e.clientY;
    // 目標元素的頂部座標
    const photoPositionTop = mainContainerElement.current?.offsetTop;
    // 瀏覽器可視區的頂部座標
    const windowPosition = window.scrollY;

    // 滑鼠是否進入目標元素的判斷
    if (mousePosition + windowPosition > photoPositionTop) {
      // 為確保滑鼠進入目標元素中時，只需執行一次，而不是一直執行，所以加入 mouseInPhotos.current (true or false) 的控制
      if (mouseInPhotos.current) {
        // 確保使用者可以看到目標元素
        window.scrollTo(0, mainContainerElement.current.offsetTop);
        // 加入 setTimeout 延遲禁止瀏覽器關閉 scroll 行為
        setTimeout(() => {
          document.documentElement.style.overflowY = 'hidden';
        }, 500);
      }
      mouseInPhotos.current = false;
    } else {
      // 滑鼠離開部標元素時，開啟瀏覽器 scroll 行為
      document.documentElement.style.overflowY = 'auto';
      mouseInPhotos.current = true;
    }
  };
  ...
  // 使用 useMouseMove custom hook
  useMouseMove(handleMouseMove)
  ...
}
```

- 在目標元素上掛載 onScroll 事件

```javascript
// HorizontalCards.jsx
<div
  // 掛載 onScroll 事件
  onScroll={handleOnScroll}
  className={styles.main__container}
  ref={mainContainerElement}
  style={{ height: `${mainContainerHeight}px` }}
>
  ...
</div>
```

- handleOnScroll 作為目標元素 onScroll 事件的 eventHandler。
- 用 useState hook 保存元素垂直滾動的值 (scrollLeft)，並用 setState 改變 (setScrollLeft)。
- 當滾動的範圍為 0 時，setScrollLeft(scrollValue) (scrollValue 為 0)，開啟瀏覽器的 scroll 行為，滾動的上限值為目標元素的寬超出瀏覽器可視區的範圍 (photoWidth - windowWidth)。

```javascript
// HorizontalCards.jsx
export default function Photos() {
  ...
  const handleOnScroll = () => {
    // 目標元素垂直滾動的值
    const scrollValue = photoElements.current?.offsetTop;
    // 目標元素的寬度
    const photoWidth = photoContainerElement.current?.offsetWidth;
    // 瀏覽器可是區的寬度
    const windowWidth = window.innerWidth;

    document.documentElement.style.overflowY = 'hidden';
    if (scrollValue === 0) {
      // 目標元素滾動的起始值 scrollValue = 0
      setScrollLeft(scrollValue);
      document.documentElement.style.overflowY = 'auto';
    } else if (scrollValue >= photoWidth - windowWidth) {
      // 目標元素滾動的終點值 scrollValue >= photoWidth - windowWidth
      setScrollLeft(photoWidth - windowWidth);
    } else {
      // 起始與終點的範圍
      setScrollLeft(scrollValue);
    }
  };
  ...
}
```

- Tinking：元素要如何做到可以垂直滾動，但視覺上事水平移動？
- 元素裡面的垂直內容要有一定的高度，元素設定 overflow-y: scroll 以 scroll 的方式實作超出的內容。以元素的寬度設定為高度(假的高度，圖片高以外的都空白)。

```javascript
// HorizontalCards.jsx
export default function Photos() {
  ...
  // 儲存最外層容器的高度，與實際圖片的高相等
  const [mainContainerHeight, setMainContainerHeight] = useState();
  // 儲存滾動的容器的高度，與元素的寬相等
  const [scrollContainerHeight, setScrollContainerHeight] = useState();
  // 最外層容器
  const mainContainerElement = useRef();
  // 滾動的元素
  const photoContainerElement = useRef();
  // 每張圖片的容器
  const photoElements = useRef();
  ...
  const setStatefunc = () => {
    setMainContainerHeight(photoElements.current.clientHeight);
    setScrollContainerHeight(photoContainerElement.current.offsetWidth);
  };
  ...
}
```

- 以 mainContainerHeight 和 scrollContainerHeight 去改變元素的的 style。
- 並結合 css position: sticky，達到垂直滾動時裡面的元素被釘在最上方，看似沒有垂直移動的效果。

```javascript
...
 <div
  onScroll={handleOnScroll}
  className={styles.main__container}
  ref={mainContainerElement}
  // 高度與實際的圖片相等
  style={{ height: `${mainContainerHeight}px` }}
>
  <div
    className={styles.scroll__container}
    ref={photoContainerElement}
    style={{
      // 高度與元素的寬度相等，為了有垂直滾動的功能
      height: `${scrollContainerHeight}px`,
      transform: `translate(${-scrollLeft}px, 0)`,
    }}
  >
  // .photos 的 position 設定為 sticky、top: 0，達到垂直滾動時元素並沒有跟著垂直移動
    <div className={styles.photos} ref={photoElements}>
      {photos.map(photo => (
        <div key={photo.id} className={styles.photo}>
          <img src={photo.photoSrc} alt={`圖片${photo.id}`} />
        </div>
      ))}
    </div>
  </div>
</div>
...
```

```css
.photos {
  /* position: sticky、top: 0，實作位置不會跟著垂直滾動而跟著垂直移動 */
  position: sticky;
  top: 0;
  width: max-content;
  height: min-content;
  display: flex;
}
```

- 垂直滾動的值已被 scrollLeft state 保存，透過 scrollLeft 改變元素 style 水平的位置 (transform: `translate(${-scrollLeft}px, 0)`)，以達到水平滾動的效果

```javascript
export default function Photos() {
  const [scrollLeft, setScrollLeft] = useState(0);
  ...
   return (
    <div
      onScroll={handleOnScroll}
      className={styles.main__container}
      ref={mainContainerElement}
      style={{ height: `${mainContainerHeight}px` }}
    >
      <div
        className={styles.scroll__container}
        ref={photoContainerElement}
        style={{
          height: `${scrollContainerHeight}px`,
          transform: `translate(${-scrollLeft}px, 0)`,
        }}
      >
      ...
      </div>
    </div>
  );

}
```

- 優化，為了不讓元素橫向移動的過程，視窗也跟著上下移動，在特定地方加入 document.documentElement.style.overflowY = 'hidden' 移除瀏覽器的 scroll，document.documentElement.style.overflowY = 'auto' 恢復瀏覽器的 scroll。
