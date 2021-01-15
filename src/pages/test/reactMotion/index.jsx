import React, { useState } from 'react';
import {
  Motion,
  spring,
  presets,
  StaggeredMotion,
  TransitionMotion,
} from 'react-motion';
import { Button } from 'antd';
import styles from './index.less';

const MotionBox = () => {
  const [left, setLeft] = useState(0);
  const [height, setHeight] = useState(100);
  const temp = Array(3).fill({ h: 0 });
  const move = () => {
    if (left === 200) {
      setLeft(100);
    } else {
      setLeft(200);
    }
  };
  const changeHeight = () => {
    if (height === 100) {
      setHeight(200);
    } else {
      setHeight(100);
    }
  };

  const [show, setShow] = useState(false);

  const willEnter = () => {
    return { scale: 0 };
  };

  const willLeave = () => {
    return { scale: spring(0, presets.wobbly) };
  };
  return (
    <>
      <Motion
        defaultStyle={{ x: 0 }}
        style={{ x: spring(left, presets.gentle) }}
      >
        {interpolatingStyle => (
          <div
            className={styles.box}
            style={{
              transform: `translateX(${interpolatingStyle.x}px)`,
              backgroundColor: 'red',
            }}
          >
            <span>{interpolatingStyle.x}</span>
          </div>
        )}
      </Motion>
      <Button onClick={() => move()}>test</Button>

      <StaggeredMotion
        defaultStyles={temp}
        styles={prevInterpolatedStyles =>
          prevInterpolatedStyles.map((_, i) => {
            return i === 0
              ? { h: spring(height, presets.gentle) }
              : { h: spring(prevInterpolatedStyles[i - 1].h, presets.gentle) };
          })
        }
      >
        {interpolatingStyles => (
          <div>
            {interpolatingStyles.map((style, i) => (
              <div key={i} style={{ border: '1px solid', height: style.h }} />
            ))}
          </div>
        )}
      </StaggeredMotion>
      <Button onClick={() => changeHeight()}>test2</Button>

      <TransitionMotion
        willEnter={() => willEnter()}
        willLeave={() => willLeave()}
        styles={
          show
            ? [{ key: '1', style: { scale: spring(1, presets.wobbly) } }]
            : []
        }
      >
        {inStyle =>
          inStyle[0] ? (
            <div
              style={{
                transform: `scale(${inStyle[0].style.scale})`,
                width: '100px',
                height: '100px',
                backgroundColor: '#000',
              }}
            >
              <span style={{ color: '#fff' }}>{inStyle[0].style.scale}</span>
            </div>
          ) : null
        }
      </TransitionMotion>
      <Button onClick={() => setShow(x => !x)}>test3</Button>
    </>
  );
};

export default MotionBox;
