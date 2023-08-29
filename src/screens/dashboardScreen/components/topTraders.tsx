import React from 'react';

const TopTraders = (): JSX.Element => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='font-bold text-white'>Top Traders</div>
      <div className='bg-back-200 flex w-full gap-12 rounded p-5'>
        <table className='w-full'>
          <thead>
            <tr className='text-text-100 text-sm'>
              <td className='p-1 text-center'>Address</td>
              <td className='p-1 text-center'>Wallet Amount</td>
              <td className='p-1 text-center'>PnL%</td>
              <td className='p-1 text-center'>Win Rate</td>
              <td className='p-1 text-center'></td>
            </tr>
          </thead>
          <tbody className='text-sm text-white'>
            <tr className='h-10 rounded bg-transparent px-4 py-3'>
              <td className='p-1 text-center'>01e0ffn...</td>
              <td className='p-1 text-center'>$1,043,5420</td>
              <td className='p-1 text-center text-[#3AB275]'>-$2.14</td>
              <td className='p-1 text-center'>10%</td>
              <td className='p-1 text-center'>Copy Trade</td>
            </tr>
            <tr className='bg-back-400 h-10 rounded px-4 py-3'>
              <td className='p-1 text-center'>01e0ffn...</td>
              <td className='p-1 text-center'>$1,043,5420</td>
              <td className='p-1 text-center text-[#3AB275]'>-$2.14</td>
              <td className='p-1 text-center'>10%</td>
              <td className='p-1 text-center'>Copy Trade</td>
            </tr>
            <tr className='h-10 rounded bg-transparent px-4 py-3'>
              <td className='p-1 text-center'>01e0ffn...</td>
              <td className='p-1 text-center'>$1,043,5420</td>
              <td className='p-1 text-center text-[#3AB275]'>-$2.14</td>
              <td className='p-1 text-center'>10%</td>
              <td className='p-1 text-center'>Copy Trade</td>
            </tr>
            <tr className='bg-back-400 h-10 rounded px-4 py-3'>
              <td className='p-1 text-center'>01e0ffn...</td>
              <td className='p-1 text-center'>$1,043,5420</td>
              <td className='p-1 text-center text-[#3AB275]'>-$2.14</td>
              <td className='p-1 text-center'>10%</td>
              <td className='p-1 text-center'>Copy Trade</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopTraders;
