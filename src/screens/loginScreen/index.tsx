import dynamic from 'next/dynamic';

import withAuth from '@/components/common/withAuth';

const LoginRedirect = dynamic(() => import('@/components/auth/loginRedirect'), {
  ssr: false,
});
export default withAuth(LoginRedirect);
