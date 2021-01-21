import React from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import './index.less';

function Slider() {
  const [{ x, bg, size }, set] = useSpring(() => ({
    x: 0,
    bg: 'linear-gradient(120deg, #96fbc4 0%, #f9f586 100%)',
    size: 1,
  }));
  const bind = useDrag(({ movement, down }) => {
    set({
      x: down ? movement[0] : 0,
      bg: `linear-gradient(120deg, ${
        movement[0] < 0 ? '#f093fb 0%, #f5576c' : '#96fbc4 0%, #f9f586'
      } 100%)`,
      size: down ? 1.1 : 1,
      immediate: key => down && key === 'x', // 立即执行动画，没有延迟效果（无config效果）
    });
  });

  const avSize = x.interpolate({
    map: Math.abs,
    range: [50, 300],
    output: ['scale(0.5)', 'scale(1)'],
    extrapolate: 'clamp', // 左值和右值： 都使用clamp效果（有边缘），比如在这里就是最小scale(0.5) 最大scale(1)， 如果不设置的话，会有弹簧效应
  });

  return (
    <animated.div className="item" {...bind()} style={{ background: bg }}>
      <animated.div
        className="av"
        style={{
          transform: avSize,
          justifySelf: x.interpolate(v => (v < 0 ? 'end' : 'start')),
        }}
      ></animated.div>
      <animated.div
        className="fg"
        style={{
          transform: interpolate(
            [x, size],
            (x, s) => `translate3d(${x}px,0,0) scale(${s})`,
          ),
        }}
      >
        {avSize.interpolate(v => v)}
      </animated.div>
    </animated.div>
  );
}

export default Slider;
