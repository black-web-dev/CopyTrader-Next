import Axios from '../axios';

export function getBalance() {
  return Axios.post('/api/copy/balance_eth', {});
}
