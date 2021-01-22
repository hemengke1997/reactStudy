import React, { useState } from 'react';
import { Button } from 'antd';

// import Demo from './spring/index';

import Demo1 from './demo1/index';
import Demo2 from './demo2/index';
import Demo3 from './demo3/index';
import Demo4 from './demo4';
import Demo from './demo8';

const T = () => {
  const [num, setNum] = useState(1);

  const test = () => {};

  return (
    <>
      {/* <Button onClick={test}>open</Button>
      <Demo />
      <Demo1 />
      <Demo2 /> */}
      {/* <Demo3>click</Demo3> */}
      <Demo />
    </>
  );
};

export default T;
