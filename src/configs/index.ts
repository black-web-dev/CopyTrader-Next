export const COPY_TRADER_INDEX = {
  abi: require('./abi/copy_trader_index.json'),
  address:
    process.env.NEXT_PUBLIC_COPY_TRADER_INDEX ||
    '0x46dd81fA5257E241A42422f225C9AA656086586E',
};

export const COPY_TRADER_ACCOUNT = {
  abi: require('./abi/copy_trader_account.json'),
};

export const GMX = {
  abi: require('./abi/gmx.json'),
  address:
    process.env.NEXT_PUBLIC_GMX || '0x489ee077994B6658eAfA855C308275EAd8097C4A',
};
