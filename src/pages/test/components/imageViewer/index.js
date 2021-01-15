import React, { useState, useEffect } from 'react';
import styles from './index.module.less';
import { CSSTransition } from 'react-transition-group';
import ReactDom from 'react-dom';

let changeVisible;
const ImageViewerDom = props => {
  const { rect, imageSrc } = props;

  const [visible, setVisible] = useState(false);
  const [imageStyle, setImageStyle] = useState({});

  changeVisible = v => {
    setVisible(v);
  };

  const handleTransition = visible => {
    if (visible) {
      setImageStyle({
        transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      const raq = window.requestAnimationFrame(() => {
        const width = rect.width * 2;
        const height = rect.height * 2;
        const top = (window.innerHeight - height) / 2;
        const left = (window.innerWidth - width) / 2;
        setImageStyle({
          width: `${rect.width * 2}px`,
          height: `${rect.height * 2}px`,
          transform: `translate3d(${left}px, ${top}px, 0)`,
        });
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            window.cancelAnimationFrame(raq);
          });
        } else {
          window.cancelAnimationFrame(raq);
        }
      });
    } else {
      setImageStyle({
        transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    }
  };

  useEffect(() => {
    handleTransition(visible);
  }, [visible]);

  return (
    <CSSTransition
      in={visible}
      classNames={{
        enter: styles['image-enter'],
        enterActive: styles['image-enter-active'],
        exit: styles['image-exit'],
        exitActive: styles['image-exit-active'],
      }}
      timeout={200}
      unmountOnExit
      mountOnEnter={false}
    >
      <div className={styles.imageViewer}>
        <div className={styles.imageBox} onClick={() => changeVisible(false)}>
          <img src={imageSrc} style={imageStyle} className={styles.image} />
        </div>
      </div>
    </CSSTransition>
  );
};

let _instance = null;
function imageViewer(
  props = {
    rect: new DOMRect(),
    imageSrc: '',
  },
) {
  const parentNode = document.body;
  imageViewer.container = document.createElement('div');
  _instance = ReactDom.createPortal(<ImageViewerDom {...props} />, parentNode);
  ReactDom.render(_instance, imageViewer.container);
}

const api = {
  show(payload) {
    const { rect, imageSrc } = payload;
    imageViewer({ rect, imageSrc });
    changeVisible(true);
  },
};

export default api;
