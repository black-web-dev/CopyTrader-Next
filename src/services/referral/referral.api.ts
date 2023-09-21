import Axios from '../axios';

export type InviteDetailType = {
  user_id: number;
  invite_email: string;
  firstName: string;
  lastName: string;
  sector?: string;
  company?: string;
};

export function sendInvite(inviteDetail: InviteDetailType) {
  return Axios.post('/user/invite', inviteDetail);
}

export function deleteInvite({
  user_id,
  email,
}: {
  user_id: number;
  email: string;
}) {
  return Axios.post('/user/invited_delete', { user_id, email });
}

export function getInvitedList({ user_id }: { user_id: number }) {
  return Axios.post('/user/invited_list', {
    user_id,
  });
}

export function getInviteCode({ user_id }: { user_id: number }) {
  return Axios.post('/user/invite_code', {
    user_id,
  });
}
