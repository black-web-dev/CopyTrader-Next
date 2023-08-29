export const formatNum = (num: number, fixed = 0) => {
  if (!num) return num;
  if (Math.abs(num) > 1000) {
    return num
      .toFixed(fixed)
      .toString()
      .replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (Math.abs(num) < 0.01) {
    return num.toFixed(5);
  }
  return num.toFixed(2);
};

export const classNames = (...classes: any[]) =>
  classes.filter(Boolean).join(' ');

export const shortAddress = (address: string, length = 12) => {
  return address.slice(0, length + 2) + '...' + address.slice(-length);
};
