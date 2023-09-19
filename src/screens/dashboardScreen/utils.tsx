export type TableHeader = {
  label: string;
  tooltip?: string;
  sort?: string;
};

export const tableHeader: TableHeader[] = [
  {
    label: 'time',
    sort: 'timestamp',
  },
  {
    label: 'wallet Address',
    sort: 'account',
  },
  {
    label: 'token',
    sort: 'index_token',
  },
  {
    label: 'size Delta',
    sort: 'size_delta',
  },
  {
    label: 'col Delta',
    sort: 'collateral_delta',
  },
  {
    label: 'tx hash',
    sort: 'transaction_hash',
  },
];
