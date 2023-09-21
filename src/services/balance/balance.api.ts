import Axios from '../axios';

export function getBalance() {
  return Axios.post('/copy/balance_eth', {});
}
