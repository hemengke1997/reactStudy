import React, { useEffect, useReducer, useRef, useState } from 'react';
import Toast from './toast/index';
import { Button, message } from 'antd';

const T = () => {
  const [num, setNum] = useState(1);

  const test = () => {
    Toast({
      content: 'this is content' + num,
      maxCount: 10,
      duration: 0,
      type: 'success',
      showClose: true,
    });
    setNum(num => ++num);
  };
  const hide = () => {
    // Toast.hide();
  };

  const test2 = () => {
    // Toast.show('toast2')
    // message.info('1321321321', 1000);
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
