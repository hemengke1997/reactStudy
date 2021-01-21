import React, { useState } from 'react';
import useMeasure from 'react-use-measure';
import { useSpring, animated, config } from 'react-spring';

export default function Demo() {
  const [ref, rect] = useMeasure();
  const [flag, setFlag] = useState(false);
  const { width } = useSpring({
    width: flag ? rect.width : 0,
    config: {
      ...config.default,
      clamp: true,
    },
  });

  const interp = i => r =>
    `translate3d(0, ${15 * Math.sin(r + (i * 2 * Math.PI) / 1.6)}px, 0)`;

  const t = i => {
    return r => {
      return `translate3d(0, ${15 *
        Math.sin(r + (i * 2 * Math.PI) / 1.6)}px, 0)`;
    };
  };

  return (
    <div
      ref={ref}
      onClick={() => setFlag(t => !t)}
      style={{ width: '100%', height: '100%' }}
    >
      <animated.div className="box" style={{ width }}>
        {width.interpolate(t(1))}
      </animated.div>
    </div>
  );
}
