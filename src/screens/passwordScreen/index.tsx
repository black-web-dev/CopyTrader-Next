import dynamic from 'next/dynamic';

import Password from '@/components/auth/password';
import withAuth from '@/components/common/withAuth';

const LoginRedirect = dynamic(() => import('@/components/auth/loginRedirect'), {
  ssr: false,
});

export default withAuth(Password, LoginRedirect);
