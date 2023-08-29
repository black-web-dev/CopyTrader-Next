import Link from 'next/link';
import { useState } from 'react';

import useNotification from '@/hooks/useNotification';

import { useAppDispatch } from '@/services';
import { signinAsync, signupAsync } from '@/services/auth';

import Loader from '../common/loader';

import Logo from '~/svg/logo_footer.svg';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [twitter_link, setTwitterLink] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    dispatch(
      signupAsync({
        email,
        firstName,
        lastName,
        twitter_link,
        role: 'user',
        password,
      })
    ).then((payload: any) => {
      setLoading(false);
      if (payload?.error) return;
      notification('You have successfully logged in.', 'success');
    });
  };

  const onChange = (value: any) => {
    console.log('Captcha value:', value);
  };

  return (
    <div className='bg-back-100 flex min-h-screen min-w-[304px] flex-col items-center justify-center px-6 py-12'>
      <div className='min-w-[304px] pb-12'>
        <Link href='/'>
          <Logo className='mx-auto h-[80px] w-[180px]' />
        </Link>
      </div>

      <div className='mt-4 min-w-[304px]'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-normal leading-6 text-white'
            >
              Email *
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
            <label
              htmlFor='firstName'
              className='block text-sm font-normal leading-6 text-white'
            >
              First Name
            </label>
            <div className='mt-2'>
              <input
                id='firstName'
                name='firstName'
                type='text'
                autoComplete='firstName'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-normal leading-6 text-white'
            >
              Last Name
            </label>
            <div className='mt-2'>
              <input
                id='lastName'
                name='lastName'
                type='text'
                autoComplete='lastName'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='twitterLink'
              className='block text-sm font-normal leading-6 text-white'
            >
              Twitter Link
            </label>
            <div className='mt-2'>
              <input
                id='twitterLink'
                name='twitterLink'
                type='text'
                autoComplete='twitterLink'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setTwitterLink(e.target.value)}
                value={twitter_link}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-normal leading-6 text-white'
            >
              Password
            </label>
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
          <div>
            <label
              htmlFor='confirm-password'
              className='block text-sm font-normal leading-6 text-white'
            >
              Confirm Password
            </label>
            <div className='mt-2'>
              <input
                id='confirm-password'
                name='confirm-password'
                type='password'
                autoComplete='current-password'
                required
                className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            {confirmPassword && confirmPassword !== password && (
              <div className='mt-2 text-sm text-red-500'>
                Password does not match
              </div>
            )}
          </div>

          <ReCAPTCHA
            theme='dark'
            sitekey='6LccB50nAAAAAAqDGiFHwnBnVpf9OUDUO4Fez6jK'
            onChange={onChange}
          />

          <div>
            <button
              type='submit'
              className='bg-primary-100 hover:bg-primary-100/50 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
              disabled={loading}
            >
              {loading ? <Loader /> : 'Sign up'}
            </button>
          </div>
        </form>

        <p className='mt-10 flex items-center justify-center gap-2 text-center text-xs text-white'>
          Already registered?{' '}
          <Link
            href='/login'
            className='text-primary-100 hover:text-primary-100/50 font-semibold leading-6'
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
