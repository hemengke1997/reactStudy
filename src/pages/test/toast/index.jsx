import React, { useCallback, useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import { TransitionMotion, spring, presets } from 'react-motion';
import UUID from 'uuidjs';
import classnames from 'classnames';

const Toast = props => {
  const { visible, stayTime, content } = props;
  const [visibleState, setVisibleState] = useState(false);
  const [paddingStyle, setPaddingStyle] = useState(false);

  const getStyles = useCallback(() => {
    if (visibleState) {
      return [
        {
          key: 'toast',
          style: {
            translateY: spring(0, presets.wobbly),
            maxHeight: spring(150),
            opacity: spring(1),
          },
        },
      ];
    }
    setPaddingStyle(false);
    return [];
  }, [visibleState]);

  const getDefaultStyles = () => {
    return [
      {
        key: 'toast',
        style: { translateY: -100, opacity: 0, maxHeight: 0 },
      },
    ];
  };

  const checkPadding = val => {
    if (typeof val === 'object' && !Object.is(val, NaN)) {
      console.log('x');
      return true;
    }
    return false;
  };

  const setBigBoxStyle = config => {
    return {
      maxHeight: `${config.style.maxHeight}px`,
    };
    if (checkPadding(config.style.padding)) {
      return {
        maxHeight: `${config.style.maxHeight}px`,
        padding: config.style.padding,
      };
    }
    return {
      maxHeight: `${config.style.maxHeight}px`,
    };
  };

  const setBoxStyle = config => {
    return {
      transform: `translateY(${config.style.translateY}%)`,
      opacity: `${config.style.opacity}`,
      maxHeight: `${config.style.maxHeight}px`,
    };

    if (checkPadding(config.style.padding)) {
      return {
        transform: `translateY(${config.style.translateY}%)`,
        opacity: `${config.style.opacity}`,
        maxHeight: `${config.style.maxHeight}px`,
        padding: `${config.style.padding}`,
      };
    }
    return {
      transform: `translateY(${config.style.translateY}%)`,
      opacity: `${config.style.opacity}`,
      maxHeight: `${config.style.maxHeight}px`,
    };
  };

  const afterClose = () => {
    let afterClose = props.afterClose;

    if (typeof afterClose === 'function') {
      afterClose();
    }
  };

  const hide = () => {
    setVisibleState(false);
    ToastQueue.dispatchToastList({ type: 'remove' });
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
    console.log(styleThatLeft, 'styleThatLeft');
    afterClose();
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

  const willEnter = () => {
    setPaddingStyle(true);
    return {
      translateY: -100,
      opacity: 0,
      maxHeight: 0,
    };
  };

  return (
    <TransitionMotion
      defaultStyles={getDefaultStyles()}
      styles={getStyles()}
      willEnter={() => willEnter()}
      willLeave={() => ({
        translateY: spring(-100, presets.wobbly),
        maxHeight: spring(0),
        opacity: spring(0),
      })}
      didLeave={styleThatLeft => didLeave(styleThatLeft)}
    >
      {inStyle =>
        inStyle[0] ? (
          <div
            className={classnames(
              styles.toastBigBox,
              paddingStyle ? styles.withPadding : '',
            )}
            style={setBigBoxStyle(inStyle[0])}
          >
            <div
              className={classnames(
                styles.toastBox,
                paddingStyle ? styles.withPadding : '',
              )}
              style={setBoxStyle(inStyle[0])}
              onClick={() => hide()}
            >
              {content}
            </div>
          </div>
        ) : null
      }
    </TransitionMotion>
  );
};

Toast.defaultProps = {
  visible: false,
  stayTime: 1000,
};

const ToastQueue = props => {
  const reducer = useCallback((store, action) => {
    switch (action.type) {
      case 'add':
        if (store.length >= 10) {
          store.shift();
        }
        return [...store, { ...action.data, key: UUID.generate() }];
      case 'remove':
        store.shift();
        return store;
      default:
        throw new Error('xxxx');
    }
  }, []);
  const [toastList, dispatchToastList] = useReducer(reducer, []);

  useEffect(() => {
    dispatchToastList({ type: 'add', data: props });
  }, [props]);

  useEffect(() => {
    // if (toastList[0]) {
    //   console.log(toastList[0].key);
    // }
  }, [toastList]);

  useEffect(() => {
    ToastQueue.dispatchToastList = dispatchToastList;
  }, []);

  return (
    <>
      <div className={styles.toastWrapper}>
        {toastList.length > 0 &&
          toastList.map(toast => <Toast key={toast.key} {...toast}></Toast>)}
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
