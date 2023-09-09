import { FilterType } from '.';
import Axios from '../axios';

export function getClosedPositions(filter: FilterType) {
  const options = Object.assign({}, filter);
  delete options.side;
  delete options.status;
  return Axios.post('/api/positions/closed', options);
}

export function getOpenedPositions(filter: FilterType) {
  const options = Object.assign({}, filter);
  delete options.win_loss_min;
  delete options.status;
  return Axios.post('/api/positions/open', options);
}
