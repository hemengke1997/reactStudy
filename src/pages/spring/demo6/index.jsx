import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import useMeasure from 'react-use-measure';
import * as Icons from './icon';
import './index.less';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const Tree = React.memo(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();

  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: 'translate3d(20px, 0, 0)' },
    // to: async next => {
    //   next({
    //     height: isOpen ? viewHeight : 0,
    //     opacity: isOpen ? 1 : 0,
    //     transform: `translate3d(${isOpen ? 0 : 20}px, 0, 0)`,
    //   });
    // },
    // to是可以通过渲染来驱动执行的
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px, 0, 0)`,
    },
  });

  const Icon =
    Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`];

  return (
    <div className="frame">
      <Icon
        className="icon"
        onClick={() => setOpen(t => !t)}
        style={{ opacity: children ? 1 : 0.3 }}
      ></Icon>
      <animated.span className="title" style={style}>
        {name}
      </animated.span>
      <animated.div
        className="content"
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <animated.div
          style={{ transform }}
          ref={ref}
          children={children}
        ></animated.div>
      </animated.div>
    </div>
  );
});

export default function Demo() {
  return (
    <>
      <Tree name="main" defaultOpen>
        <Tree name="hello" />
        <Tree name="subtree with children" defaultOpen>
          <Tree name="hello" />
          <Tree name="sub-subtree with children" defaultOpen>
            <Tree name="child 1" style={{ color: '#37ceff' }} />
            <Tree name="child 2" style={{ color: '#37ceff' }} />
            <Tree name="child 3" style={{ color: '#37ceff' }} />
            <Tree name="custom content">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 200,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'black',
                    borderRadius: 5,
                  }}
                />
              </div>
            </Tree>
          </Tree>
          <Tree name="hello" />
        </Tree>
        <Tree name="world" />
        <Tree name={<span>🙀 something something</span>} />
      </Tree>
    </>
  );
}
