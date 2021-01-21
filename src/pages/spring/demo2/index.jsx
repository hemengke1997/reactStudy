import React, { useState } from 'react';
import { useSpring, animated as a, config } from 'react-spring';
import './index.less';

export default function Card() {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    opacity: flipped ? 0 : 1,
    config: key => {
      if (key === 'transform') {
        return config.wobbly;
      }
      return config.default;
    },
  });

  return (
    <div className="container" onClick={() => setFlipped(state => !state)}>
      <a.div className="front t" style={{ opacity, transform }}></a.div>
      <a.div
        className="back t"
        style={{
          transform: transform.interpolate(t => `${t} rotateX(180deg)`),
          opacity: opacity.interpolate(o => 1 - o),
        }}
      ></a.div>
    </div>
  );
}
