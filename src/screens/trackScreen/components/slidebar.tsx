import clsx from 'clsx';
import Slider from 'rc-slider';
import React, { ReactNode, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const marks = {
  0: '0x',
  5: '5x',
  10: '10x',
  20: '20x',
  30: '30x',
  40: '40x',
  50: {
    style: {
      color: '#0171D9',
    },
    label: <strong>50x</strong>,
  },
};

const SlideBar = ({
  type,
  id,
  img,
  title,
  value,
  setValue,
}: {
  type: string;
  id: string;
  img: ReactNode;
  title: string;
  value?: string | number | number[];
  setValue: (type: string, id: string, value: number | number[]) => void;
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleChange = (value: number | number[]) => {
    setValue(type, id, value);
  };
  return (
    <div className='flex flex-col'>
      <div
        className='hover:bg-back-300 z-10 flex cursor-default items-center justify-between px-5 py-3 hover:text-white'
        onClick={() => setIsOpened(!isOpened)}
      >
        <div className='flex items-center gap-4'>
          <div>{img}</div>
          <div className='text-sm capitalize'>{title}</div>
        </div>
        {isOpened ? <BsChevronUp /> : <BsChevronDown />}
      </div>
      <div
        className={clsx(
          'flex flex-col ',
          isOpened
            ? 'mx-2 mb-5 max-h-screen gap-4 px-5 py-3 opacity-100'
            : 'max-h-0 gap-0 p-0 opacity-0'
        )}
      >
        <div className=''>
          <Slider
            range
            min={0}
            max={50}
            marks={marks}
            allowCross={false}
            defaultValue={[
              value && Array.isArray(value) && value[0] ? value[0] : 0,
              value && Array.isArray(value) && value[1] ? value[1] : 50,
            ]}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
export default SlideBar;
