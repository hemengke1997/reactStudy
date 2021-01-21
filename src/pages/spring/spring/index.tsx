import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './index.less';

/*
0 % { transform: scale(1); }
25 % { transform: scale(.97); }
35 % { transform: scale(.9); }
45 % { transform: scale(1.1); }
55 % { transform: scale(.9); }
65 % { transform: scale(1.1); }
75 % { transform: scale(1.03); }
100 % { transform: scale(1); }
`*/

function Demo() {
  const [state, toggle] = useState(false);
  const { x } = useSpring({ from: { x: 1 }, x: state ? 2 : 0.5 });
  return (
    <div onClick={() => toggle(!state)}>
      <animated.span
        className="box"
        style={{
          transform: x
            .interpolate({
              range: [0, 0.5, 1, 1.5, 2],
              output: [1, 0.5, 10, 10, 2],
            })
            .interpolate(x => {
              return `scale(${x})`;
            }),
        }}
      >
        {x}
      </animated.span>
    </div>
  );
}

export default Demo;
