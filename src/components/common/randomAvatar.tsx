import { minidenticon } from 'minidenticons';
import Image from 'next/image';
import { useMemo } from 'react';

type Props = {
  hash: string;
  saturation: string | number;
  lightness?: string | number;
};

export const RandomAvatar = ({
  hash,
  saturation,
  lightness,
  ...props
}: Props) => {
  const svgURI = useMemo(
    () =>
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(minidenticon(hash, saturation, lightness)),
    [hash, saturation, lightness]
  );
  return <Image src={svgURI} width={24} height={24} alt={hash} {...props} />;
};
