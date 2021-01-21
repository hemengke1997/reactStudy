import React, { useState } from 'react';

function Knob({ name, value, onChange, min = 1, max = 500 }) {
  return (
    <div>
      <label>
        {name}:{value}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        ></input>
      </label>
    </div>
  );
}

export default function useKnobs(initialValues, options) {
  const [values, setValues] = useState(initialValues);

  const Box = (
    <div
      style={{
        top: 20,
        left: 20,
        width: 150,
        zIndex: 100,
        position: 'absolute',
        padding: 20,
      }}
    >
      {Object.keys(values).map(name => (
        <Knob
          {...options}
          key={name}
          name={name}
          value={values[name]}
          onChange={newValue => setValues({ ...values, [name]: newValue })}
        ></Knob>
      ))}
    </div>
  );

  return [values, Box];
}
