import axios from 'axios';
import BigNumber from 'bignumber.js';

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
  if (!address) return '';
  return address.slice(0, length + 2) + '...' + address.slice(-length);
};

export function bnum(val: string | number | BigNumber | boolean): BigNumber {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0';
  return new BigNumber(number);
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const verifyToken = async (token: string) => {
  try {
    const response = await axios.post(`/api/verifyToken`, {
      secret: process.env.REACT_APP_SECRET_KEY,
      token,
    });
    return response.data;
  } catch (error) {
    console.log('error ', error);
  }
};
