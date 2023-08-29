import React, { ReactNode } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

import { DOTS, usePagination } from '@/hooks/usePagination';

type ItemType = {
  className: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

const Item = ({
  className = '',
  disabled,
  selected,
  onClick,
  children,
}: ItemType): JSX.Element => (
  <span
    className={`${className} relative inline-flex items-center ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 
      ${
        selected
          ? 'cursor-default bg-blue-500 text-white'
          : disabled
          ? 'cursor-not-allowed'
          : 'cursor-pointer hover:bg-gray-300 hover:text-black'
      }
    `}
    onClick={onClick}
  >
    {children}
  </span>
);

type PaginationType = {
  onPageChange: (page: string | number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
};

export const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: PaginationType) => {
  const paginationRange: (string | number)[] = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav
      className='text-text-100 isolate inline-flex -space-x-px rounded text-[0.8em] shadow sm:text-[1em]'
      aria-label='Pagination'
    >
      {/* Left navigation arrow */}
      <Item
        className='rounded-l-md p-1.5 sm:p-2'
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <span className='sr-only'>Previous</span>
        <BsChevronLeft />
      </Item>
      {paginationRange.map((pageNumber, i) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <Item
              key={i}
              className='px-3 py-1.5 sm:px-4 sm:py-2'
              disabled={true}
            >
              ...
            </Item>
          );
        }

        // Render our Page Pills
        return (
          <Item
            className='px-3 py-1.5 sm:px-4 sm:py-2'
            onClick={() => onPageChange(pageNumber)}
            selected={pageNumber === currentPage}
            key={i}
          >
            {pageNumber}
          </Item>
        );
        // return (
        //   <li
        //     className={classnames('pagination-item', {
        //       selected: pageNumber === currentPage
        //     })}
        //     onClick={() => onPageChange(pageNumber)}
        //   >
        //     {pageNumber}
        //   </li>
        // );
      })}
      {/*  Right Navigation arrow */}
      <Item
        className='rounded-r-md p-1.5 sm:p-2'
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        <span className='sr-only'>Next</span>
        <BsChevronRight />
      </Item>
      {/* <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li> */}
    </nav>
  );
};

export default Pagination;
