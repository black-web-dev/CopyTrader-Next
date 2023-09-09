import Link from 'next/link';
import React, { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import useNotification from '@/hooks/useNotification';

import { useAppDispatch } from '@/services';
import { signinAsync } from '@/services/auth';
import { verifyToken } from '@/utils';

import Button from '../common/button';

import Logo from '~/svg/logo_footer.svg';

const Login = (): JSX.Element => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = React.useState(null);
  const [captchaSuccess, setCaptchaSuccess] = React.useState<boolean>(true);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (captchaToken) {
      const valid_token = await verifyToken(captchaToken);

      if (!valid_token.success) {
        setCaptchaSuccess(false);
        return notification('Sorry!! Token invalid', 'error');
      }
    } else {
      setCaptchaSuccess(false);
      return notification('You must confirm you are not a robot', 'error');
    }

    setCaptchaSuccess(true);
    setLoading(true);

    dispatch(signinAsync({ email, password })).then((payload: any) => {
      setLoading(false);
      if (payload?.error) return;
      notification('You have successfully logged in.', 'success');
    });
  };

  const onChange = (value: any) => {
    setCaptchaToken(value);
    setCaptchaSuccess(true);
  };

  return (
    <div className='bg-back-100 flex min-h-screen flex-col items-center justify-center px-6 py-12'>
      <div className='min-w-[304px] pb-12'>
        <Link href='/'>
          <Logo className='mx-auto h-[80px] w-[180px]' />
        </Link>
      </div>

      <form className='min-w-[304px]' onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-normal leading-6 text-white'
            >
              Email
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm font-normal leading-6 text-white'
              >
                Password
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          <div className='min-h-[78px]'>
            <ReCAPTCHA
              ref={captchaRef}
              theme='dark'
              sitekey={
                process.env.NEXT_RECAPTHA_SITE_KEY ||
                '6Lfw-OwnAAAAAGX-xmkDjjiMSjS-kfOGjIVWEbam'
              }
              onChange={onChange}
            />
            {!captchaSuccess && (
              <div className='text-xs text-red-500'>
                You must confirm you are not a robot
              </div>
            )}
          </div>

          <div>
            <Button type='submit' disabled={loading} loading={loading}>
              Sign in
            </Button>
          </div>
          <Link
            href='/account/register'
            className='border-primary-100 hover:bg-primary-100/50 flex w-full justify-center rounded border px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
          >
            Sign Up
          </Link>
        </div>

        <p className='mt-5 flex flex-col items-center gap-2 '>
          <Link
            href='/forgot-password'
            className='hover:text-primary-100/50 text-xs font-semibold text-white'
          >
            Forgot password?
          </Link>
          <Link
            href='/register'
            className='hover:text-primary-100/50 text-xs font-semibold leading-6 text-white'
          >
            Join Waitlist
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
