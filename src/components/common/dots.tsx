import clsx from 'clsx';

interface DotsProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Dots({ children = <span />, className }: DotsProps) {
  return (
    <>
      <style>
        {`
          .dots::after {
            content: '.';
          }
        `}
      </style>
      <span
        className={clsx(
          'dots after:animate-ellipsis after:inline-block after:w-4 after:text-left',
          className
        )}
      >
        {children}
      </span>
    </>
  );
}
