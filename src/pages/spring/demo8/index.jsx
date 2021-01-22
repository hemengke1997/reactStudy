import React, { useRef } from 'react';
import { useSprings, animated as a } from 'react-spring';
import move from './move';
import { clamp } from 'lodash';
import { useGesture } from 'react-use-gesture';

const Card = ({ name, style }) => {
  return (
    <div style={style} className="card">
      {name}
    </div>
  );
};

export default function Demo() {
  const items = ['first', 'second', 'third', 'fourth'];
  const order = useRef(items.map((_, index) => index));

  // const [springs, setSprings] = useSprings(items.length, () => {});

  return <></>;
}
