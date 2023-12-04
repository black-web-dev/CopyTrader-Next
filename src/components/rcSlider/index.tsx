import Slider from 'rc-slider';
import React, { Dispatch } from 'react';

const marks = {
  1.1: <strong>1.1x</strong>,
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
  disabled: boolean;
  value: number | number[];
  setValue: Dispatch<number | number[]>;
};

const RcSlider = ({ disabled, value, setValue }: RcSliderType) => {
  const handleChange = (value: number | number[]) => {
    setValue(value);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const sanitizedValue = newValue.replace(/x/g, '');
    setValue(Number(sanitizedValue));
  };

  return (
    <div className='flex w-full items-center gap-5'>
      <Slider
        min={0}
        max={50}
        marks={marks}
        step={1}
        value={value}
        disabled={disabled}
        onChange={handleChange}
      />
      <div className='bg-back-100 text-text-200 rounded'>
        <input
          type='text'
          className='h-[35px] w-[60px] border-none bg-transparent text-right focus:border-0 focus:ring-0'
          value={`${value}x`}
          onChange={handleChangeValue}
        />
      </div>
    </div>
  );
};

export default RcSlider;
