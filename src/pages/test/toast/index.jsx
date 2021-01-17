import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import { TransitionMotion, spring, presets } from 'react-motion';
import UUID from 'uuidjs';

const TRANSLATEY = 120;
const Toast = React.memo(props => {
  const { visible, stayTime, content, setHide, sortKey } = props;
  const [visibleState, setVisibleState] = useState(false);
  const [height, setHeight] = useState(0);
  const [unmount, setUnmount] = useState(false);
  let timer = null;

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

  const hideAndRemove = () => {
    console.log(1);
    hide();
    debugger;
    console.log(2);
  };

  const hide = () => {
    setVisibleState(false);
    clearTimeout(timer);
  };

  const autoClose = () => {
    if (stayTime > 0) {
      timer = setTimeout(() => {
        hide();
      }, stayTime);
    }
  };

  const didLeave = styleThatLeft => {
    afterClose();
    setUnmount(true);
  };

  useEffect(() => {
    if (unmount === true) {
      setTimeout(() => {
        ToastQueue.dispatchToastList({ type: 'remove' });
      });
    }
  }, [unmount]);

  useEffect(() => {
    setHide({ hideAndRemove, sortKey });
    return () => {
      console.log('toast => unmount');
    };
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
});

Toast.defaultProps = {
  visible: false,
  stayTime: 3000,
  maxCount: 2,
};

const ToastQueue = props => {
  const { maxCount } = props;
  const reducer = (store, action) => {
    const t = [...store];
    switch (action.type) {
      case 'add':
        if (t.length >= maxCount) {
          // 父组件调用子组件的hide方法，并且在返回值中设置一个hasHide
          console.log(t[0]);
          t[0].hide();
        }
        return [...t, { ...action.data, sortKey: UUID.generate() }];
      case 'remove':
        t.shift();
        return t;
      case 'setHideMethod':
        const {
          data: { sortKey, hide },
        } = action;
        const index = t.findIndex(item => {
          return item.sortKey === sortKey;
        });
        if (index !== -1) {
          t[index] = { ...t[index], hide: hide };
        }
        return t;
      case 'hide':
        const { data } = action;
        const returnVal = t.map(item => {
          if (data === item.sortKey) {
            return {
              ...item,
              hasHide: true,
            };
          }
          return { ...item };
        });
        console.log('x');
        return returnVal;
      default:
        throw new Error('xxxx');
    }
  };

  const [toastList, dispatchToastList] = useReducer(reducer, []);

  useEffect(() => {
    console.log(toastList);
  }, [toastList]);

  const setHide = data => {
    const { hideAndRemove, sortKey } = data;
    dispatchToastList({
      type: 'setHideMethod',
      data: { sortKey: sortKey, hide: hideAndRemove },
    });
  };

  useEffect(() => {
    dispatchToastList({ type: 'add', data: props });
  }, [props]);

  useEffect(() => {
    ToastQueue.dispatchToastList = dispatchToastList;
  }, []);

  return (
    <>
      <div className={styles.toastWrapper}>
        {toastList.length > 0 &&
          toastList.map(toast => (
            <Toast key={toast.sortKey} {...toast} setHide={setHide}></Toast>
          ))}
      </div>
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

Toast.hideAll = function() {};

Toast.unmountNode = function() {
  const { _instance } = ToastQueue;
  if (_instance) {
    ReactDOM.render(<></>, _instance);
    ToastQueue.containerDOM.removeChild(_instance);
    Toast._instance = null;
  }
};

export default Toast;
