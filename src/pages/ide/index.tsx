import React, { createRef, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import styles from './index.module.less';
import './index.less';
import { CSSTransition } from 'react-transition-group';

const Ide = () => {
  const [box1, setBox1] = useState<boolean>(false);
  const c = {
    current: null,
  };
  console.log('0');
  useEffect(() => {
    console.log('1');
  });
  console.log('2');
  const r = useRef<number>(0);

  return (
    <>
      <CSSTransition
        in={box1}
        classNames="box1"
        timeout={1000}
        onEnter={() => {
          console.log('enter');
        }}
        unmountOnExit
        onEntered={() => {
          console.log('entered');
        }}
        onEntering={() => {
          console.log('entering');
        }}
      >
        <div className={styles.test}>1231</div>
      </CSSTransition>

      <Button
        type="primary"
        ref={c}
        onClick={() => {
          setBox1(!box1);
          r.current = (r.current as number) + 1;
          console.log(c.current);
        }}
      >
        change
      </Button>
    </>
  );
};

export default Ide;
