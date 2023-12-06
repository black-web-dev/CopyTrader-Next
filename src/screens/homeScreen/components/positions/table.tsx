import React from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

import Loader from '@/components/common/loader';
import Tooltip from '@/components/common/tooltip';

import NotFound from '@/assets/images/not-found.svg';
import { FollowDetailType } from '@/services/position';

import FollowDetail from './followDetail';

const Table = ({
  isFetching,
  data,
}: {
  isFetching: boolean;
  data: FollowDetailType[];
  sort: string;
  setSort: (sort: string) => void;
}) => {
  return (
    <div className='bg-back-200 w-full rounded p-2 min-h-[150px]'>
      <table className='w-full'>
        <thead className='text-text-100 text-xs capitalize'>
          <tr>
            <th className='px-2 py-1'></th>
            <th className='w-[200px] px-2 py-1'>
              <div className='flex w-fit items-center gap-1'>
                <div>Address</div>
                <Tooltip isTag={true} position='top' content='Token address'>
                  <AiOutlineExclamationCircle className='text-text-100' />
                </Tooltip>
              </div>
            </th>
            <th className='px-2 py-1'>Status</th>
            <th className='w-[200px] px-2 py-1'>Current Value</th>
            <th className='w-[200px] px-2 py-1'>Current Value (USD)</th>
            <th className='px-2 py-1'>PnL %</th>
            <th className='w-[200px] px-2 py-1'>DSA</th>
            <th className='px-2 py-1'></th>
          </tr>
        </thead>
        <tbody className='text-xs'>
          {!isFetching && data.length > 0 && <FollowDetail data={data[0]} />}
          {isFetching && (
            <tr>
              <td colSpan={8}>
                <div className='flex min-h-[200px] items-center justify-center'>
                  <Loader size='40px' strokewidth={1.5} />
                </div>
              </td>
            </tr>
          )}
          {!isFetching && data.length === 0 && (
            <tr>
              <td colSpan={8}>
                <div className='flex flex-col items-center justify-center'>
                  <NotFound className='h-[150px] w-[150px]' />
                  <div className='text-text-100'>No Data</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
