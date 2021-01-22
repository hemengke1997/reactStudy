import React from 'react';
import { useSpring, animated as a } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';
import './index.less';

export default function Demo() {
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));
  const bindFn = useDrag(({ velocity, down, movement }) => {
    velocity = clamp(velocity, 1, 8);
    set({
      xy: down ? movement : [0, 0],
      config: { mass: velocity, tension: 500 * velocity, friction: 30 },
      immediate: down ? true : false,
    });
  });

  return (
    <a.div
      className="circle"
      {...bindFn()}
      style={{
        transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
      }}
    ></a.div>
  );
}
