import React, { useEffect, useReducer, useRef } from 'react';
import Toast from './toast';
import { Button, message } from 'antd';
import MotionBox from './reactMotion';

const T = () => {
  const test = () => {
    Toast.show('content');
  };
  const hide = () => {
    Toast.hide();
  };

  const test2 = () => {
    // Toast.show('toast2')
    message.info('1321321321', 1000);
  };

  return (
    <>
      <Button onClick={() => test()}>open</Button>
      <Button onClick={() => hide()}>close</Button>
      <Button onClick={() => test2()}>2222</Button>
    </>
  );
};

export default T;
