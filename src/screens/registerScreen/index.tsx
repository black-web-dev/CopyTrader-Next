import dynamic from 'next/dynamic';

import Register from '@/components/auth/regsiter';
import withAuth from '@/components/common/withAuth';

const LoginRedirect = dynamic(() => import('@/components/auth/loginRedirect'), {
  ssr: false,
});
export default withAuth(LoginRedirect, Register);
