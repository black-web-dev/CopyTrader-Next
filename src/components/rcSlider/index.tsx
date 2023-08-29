import Slider from 'rc-slider';
import React, { Dispatch } from 'react';

const marks = {
  0: '',
  1.2: <strong>1.2x</strong>,
  5: '5x',
  10: '10x',
  20: '20x',
  30: '30x',
  40: '40x',
  50: {
    style: {
      color: '#2d42fc',
    },
    label: <strong>50x</strong>,
  },
};

type RcSliderType = {
  value: number | number[];
  setValue: Dispatch<number | number[]>;
};

const RcSlider = ({ value, setValue }: RcSliderType) => {
  const handleChange = (value: number | number[]) => {
    setValue(value);
  };
  return (
    <div className='w-full'>
      <Slider
        min={0}
        max={50}
        marks={marks}
        step={1}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default RcSlider;
