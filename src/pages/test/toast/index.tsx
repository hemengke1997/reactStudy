import React, {
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useState,
  RefCallback,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.less';
import {
  TransitionMotion,
  spring,
  presets,
  TransitionStyle,
} from 'react-motion';
import UUID from 'uuidjs';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';

const TRANSLATEY = 100;

export type messageType = 'info' | 'success' | 'warning' | 'error' | 'loading';

export type contentType = string | MessageProps | ReactNode;

export interface MessageQueueProps {
  visible: boolean;
  duration?: number;
  content: contentType;
  onClose?: () => void;
  maxCount: number;
  showClose?: boolean;
  offset: number;
  type: messageType;
}

export interface MessageProps extends MessageQueueProps {
  sortKey: string;
}

export interface MessageInterface
  extends React.MemoExoticComponent<(props: MessageProps) => JSX.Element> {
  defaultProps: MessageQueueProps;
  unmountNode: () => void;
  show: (content: contentType) => void;
  hideAll: () => void;
}

export interface MessageQueueInterface
  extends React.MemoExoticComponent<(props: MessageQueueProps) => JSX.Element> {
  _instance: HTMLDivElement | null;
  dispatchMessageList: React.Dispatch<actionType>;
  [key: string]: any;
}

export interface actionType {
  type: 'add' | 'remove' | 'hide';
  data?: any;
}

const Message: MessageInterface = React.memo((props: MessageProps) => {
  const {
    visible,
    duration,
    content,
    onClose,
    sortKey,
    showClose,
    type,
  } = props;
  const [height, setHeight] = useState<number>(0);
  const [manualClose, setManualClose] = useState<boolean>(false);
  let timer: number;

  const getStyles = useCallback(() => {
    if (visible) {
      return [
        {
          key: 'message',
          style: {
            translateY: spring(0, presets.wobbly),
            height: height,
            opacity: spring(1),
            translateX: 0,
          },
        },
      ];
    }
    return [];
  }, [visible, height]);

  const afterClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const hide = (manual = false) => {
    manual && setManualClose(true);
    // 告诉父组件，这个子组件的visible改为false
    MessageQueue.dispatchMessageList({ type: 'hide', data: sortKey });
    clearTimeout(timer);
  };

  const autoClose = () => {
    if ((duration as number) > 0) {
      timer = setTimeout(() => {
        hide();
      }, duration);
    }
  };

  const didLeave = (styleThatLeft: TransitionStyle) => {
    afterClose();
    // TransitonMotion组件会在didLeave中做一些异步操作，
    // 如果直接卸载此组件，会导致异步操作报错，
    // 所以使用setTimeout宏任务，排在源代码的异步操作后面
    setTimeout(() => {
      MessageQueue.dispatchMessageList({ type: 'remove', data: sortKey });
    }, 0);
  };

  useEffect(() => {
    return () => {
      console.log('message => unmount');
    };
  }, []);

  useEffect(() => {
    if (visible) {
      autoClose();
    }
  }, [visible]);

  const getNode: RefCallback<HTMLElement> = ref => {
    if (ref) {
      setHeight(ref.getBoundingClientRect().height);
    }
  };

  // 策略模式?
  const typeIcon = {
    info: <></>,
    success: (
      <CheckCircleFilled style={{ color: '#52c41a', marginRight: '12px' }} />
    ),
    error: (
      <CloseCircleFilled style={{ color: 'ff5050', marginRight: '12px' }} />
    ),
    warning: (
      <ExclamationCircleFilled
        style={{ color: 'hsl(31, 83.1%, 55.9%)', marginRight: '12px' }}
      />
    ),
    loading: <LoadingOutlined style={{ marginRight: '12px' }} />,
  };

  return (
    <TransitionMotion
      styles={getStyles()}
      defaultStyles={[
        {
          style: {
            translateY: -TRANSLATEY,
            opacity: 0,
            translateX: 0,
          },
          key: 'message',
        },
      ]}
      willEnter={() => ({
        translateY: -TRANSLATEY,
        opacity: 0,
        translateX: 0,
      })}
      willLeave={() => {
        if (manualClose) {
          return {
            translateX: spring(-TRANSLATEY),
            translateY: spring(0),
            height: spring(0),
            opacity: spring(0),
          };
        }
        return {
          translateY: spring(-TRANSLATEY),
          height: spring(0),
          opacity: spring(0),
          translateX: 0,
        };
      }}
      didLeave={styleThatLeft => didLeave(styleThatLeft)}
    >
      {inStyle =>
        inStyle[0] ? (
          <div
            style={{
              height: `${inStyle[0].style.height}px`,
              opacity: `${inStyle[0].style.opacity}`,
            }}
            className={styles.messageContainer}
          >
            <div
              ref={getNode}
              className={styles.messageBigBox}
              style={{
                transform: `translate(0,${inStyle[0].style.translateY}%)`,
              }}
            >
              <div
                className={styles.messageBox}
                style={{
                  transform: `translate(${inStyle[0].style.translateX}%,0)`,
                  pointerEvents: visible ? 'all' : 'none',
                }}
              >
                {typeIcon[type]}
                {content}
                {showClose && (
                  <CloseCircleOutlined
                    style={{ marginLeft: '12px' }}
                    onClick={() => hide(true)}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )
      }
    </TransitionMotion>
  );
}) as any;

Message.defaultProps = {
  content: '',
  visible: false,
  duration: 3000,
  maxCount: 5,
  showClose: false,
  onClose: () => null,
  offset: 16,
  type: 'info',
};

const MessageQueue: MessageQueueInterface = React.memo(
  (props: MessageQueueProps) => {
    const { maxCount, offset } = props;
    const reducer = (store: MessageProps[], action: actionType) => {
      const t = [...store];
      switch (action.type) {
        case 'add': {
          const visibleList = t.filter(item => item.visible === true);
          if (visibleList.length >= maxCount) {
            // visible false
            for (let i = 0; i < t.length; i++) {
              if (t[i].visible) {
                t[i].visible = false;
                break;
              }
            }
          }
          return [...t, { ...action.data, sortKey: UUID.generate() }];
        }
        case 'remove': {
          const { data: sortKey } = action;
          const x = t.filter(item => item.sortKey !== sortKey);
          if (!x.length) {
            setTimeout(() => {
              Message.unmountNode();
            }, 0);
          }
          return x;
        }
        case 'hide': {
          const { data: sortKey } = action;
          const x = t.map(item => {
            if (item.sortKey === sortKey) {
              return { ...item, visible: false };
            }
            return item;
          });
          return x;
        }
        default:
          throw new Error('xxxx');
      }
    };

    const [messageList, dispatchMessageList] = useReducer<
      React.Reducer<MessageProps[], actionType>
    >(reducer, []);

    useEffect(() => {
      dispatchMessageList({ type: 'add', data: props });
    }, [props]);

    useEffect(() => {
      MessageQueue.dispatchMessageList = dispatchMessageList;
    }, []);

    return (
      <>
        <div
          className={styles.messageWrapper}
          style={{ top: `${offset - 8}px` }}
        >
          {messageList.length > 0 &&
            messageList.map(message => (
              <Message key={message.sortKey} {...message}></Message>
            ))}
        </div>
      </>
    );
  },
) as any;

const contentIsMessageProps = function(content: contentType) {
  return (
    typeof content === 'object' && content !== null && 'content' in content
  );
};

MessageQueue._instance = null;

// 看似挂在message上，其实都是对MessageQueue操作
Message.show = function(content: contentType) {
  let props = {
    ...Message.defaultProps,
    visible: true,
  };
  if (contentIsMessageProps(content)) {
    props = {
      ...props,
      ...(content as MessageProps),
    };
  } else {
    props = {
      ...props,
      content,
    };
  }
  if (!MessageQueue._instance) {
    MessageQueue._instance = document.createElement('div');
    MessageQueue._instance.classList.add('MessageQueue');
    MessageQueue.containerDOM = document.body;
    MessageQueue.containerDOM.appendChild(MessageQueue._instance);
    // 第一次渲染
    ReactDOM.render(<MessageQueue {...props} />, MessageQueue._instance);
  } else {
    MessageQueue.dispatchMessageList({ type: 'add', data: props });
  }
};
Message.hideAll = function() {};
Message.unmountNode = function() {
  const { _instance } = MessageQueue;
  if (_instance) {
    ReactDOM.render(<></>, _instance);
    MessageQueue.containerDOM.removeChild(_instance);
    MessageQueue._instance = null;
  }
};

/**
 * @description 统一的show方法
 * @param contentType string | ReactNode | Object
 */
const _show = Message.show;

export default _show;
