import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useRef,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import { TransitionMotion, spring, presets } from 'react-motion';
import UUID from 'uuidjs';

const TRANSLATEY = 120;
const Toast = props => {
  const { visible, stayTime, content } = props;
  const [visibleState, setVisibleState] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    console.log('props');
  }, [props]);

  const getStyles = useCallback(() => {
    if (visibleState) {
      return [
        {
          key: 'toast',
          style: {
            translateY: spring(0, presets.wobbly),
            height: height,
            opacity: spring(1),
          },
        },
      ];
    }
    return [];
  }, [visibleState, height]);

  const afterClose = () => {
    let afterClose = props.afterClose;
    if (typeof afterClose === 'function') {
      afterClose();
    }
  };

  const hide = () => {
    setVisibleState(false);
  };

  const autoClose = () => {
    if (stayTime > 0) {
      let timer = setTimeout(() => {
        hide();
        clearTimeout(timer);
      }, stayTime);
    }
  };

  const didLeave = styleThatLeft => {
    afterClose();
    ToastQueue.dispatchToastList({ type: 'remove' });
  };

  useEffect(() => {
    Toast.hideHelper = hide;
  }, []);

  useEffect(() => {
    setVisibleState(visible);
  }, [visible]);

  useEffect(() => {
    if (visibleState) {
      autoClose();
    }
  }, [visibleState]);

  const getNode = ref => {
    if (ref) {
      setHeight(ref.getBoundingClientRect().height);
    }
  };

  return (
    <TransitionMotion
      styles={getStyles()}
      defaultStyles={[
        {
          style: {
            translateY: -TRANSLATEY,
            opacity: 0,
          },
          key: 'toast',
        },
      ]}
      willEnter={() => ({
        translateY: -TRANSLATEY,
        opacity: 0,
      })}
      willLeave={() => ({
        translateY: spring(-TRANSLATEY),
        height: spring(0),
        opacity: spring(0),
      })}
      didLeave={styleThatLeft => didLeave(styleThatLeft)}
    >
      {inStyle =>
        inStyle[0] ? (
          <div
            style={{
              opacity: `${inStyle[0].style.opacity}`,
              height: `${inStyle[0].style.height}px`,
            }}
          >
            <div
              ref={getNode}
              className={styles.toastBigBox}
              style={{
                transform: `translateY(${inStyle[0].style.translateY}%)`,
              }}
            >
              <div className={styles.toastBox} onClick={() => hide()}>
                {content}
              </div>
            </div>
          </div>
        ) : null
      }
    </TransitionMotion>
  );
};

Toast.defaultProps = {
  visible: false,
  stayTime: 3000,
  maxCount: 6,
};

const ToastQueue = props => {
  const { maxCount } = props;
  const reducer = useCallback((store, action) => {
    switch (action.type) {
      case 'add':
        if (store.length >= maxCount) {
          // 让最前面的那个toast消失
        }
        return [...store, { ...action.data, key: UUID.generate() }];
      case 'remove':
        const t = [...store];
        t.shift();
        return t;
      default:
        throw new Error('xxxx');
    }
  }, []);

  const [toastList, dispatchToastList] = useReducer(reducer, []);

  useEffect(() => {
    dispatchToastList({ type: 'add', data: props });
  }, [props]);

  useEffect(() => {
    ToastQueue.dispatchToastList = dispatchToastList;
  }, []);

  const ToastList = useMemo(() => {
    if (!toastList.length) return null;
    console.log(toastList, 'toastList');
    return toastList.map(toast => <Toast key={toast.key} {...toast}></Toast>);
  }, [toastList.length]);

  return (
    <>
      <div className={styles.toastWrapper}>{ToastList}</div>
    </>
  );
};

const contentIsToastProps = function(content) {
  return typeof content === 'object' && 'content' in content;
};

ToastQueue._instance = null;

Toast.show = function(content) {
  let props;
  if (contentIsToastProps(content)) {
    props = {
      ...Toast.defaultProps,
      ...content,
      visible: true,
    };
  } else {
    props = {
      ...Toast.defaultProps,
      content,
      visible: true,
    };
  }
  if (!ToastQueue._instance) {
    ToastQueue._instance = document.createElement('div');
    ToastQueue._instance.classList.add('toastQueue');
    ToastQueue.containerDOM = document.body;
    ToastQueue.containerDOM.appendChild(ToastQueue._instance);
    // 第一次渲染
    ReactDOM.render(<ToastQueue {...props} />, ToastQueue._instance);
  } else {
    ToastQueue.dispatchToastList({ type: 'add', data: props });
  }
};

Toast.hide = function() {
  return;
  if (Toast._instance) {
    Toast.hideHelper();
  }
};

Toast.unmountNode = function() {
  const { _instance } = ToastQueue;
  if (_instance) {
    ReactDOM.render(<></>, _instance);
    ToastQueue.containerDOM.removeChild(_instance);
    Toast._instance = null;
  }
};

export default Toast;
