import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import useNotification from '@/hooks/useNotification';

import { useAppDispatch } from '@/services';
import { changePasswordAsync, selectUserdata } from '@/services/auth';

import Button from '../common/button';

import Logo from '~/svg/logo_footer.svg';

interface FormValues {
  oldPassword: string;
  newPassword: string;
}

const Password = (): JSX.Element => {
  const router = useRouter();
  const user = useSelector(selectUserdata);
  const [loading, setLoading] = React.useState(false);

  const [isShow, setIsShow] = React.useState(false);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const validationSchema: Yup.Schema<FormValues> = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Current Password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), ''], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (value: FormValues) => {
    if (loading) return;

    setLoading(true);

    dispatch(changePasswordAsync({ user_id: `${user.id}`, ...value })).then(
      (payload: any) => {
        setLoading(false);
        if (payload?.error) return;
        notification('You have successfully changed password.', 'success');

        router.push('/account/logout');
      }
    );
  };

  return (
    <div className='bg-back-100 flex min-h-screen flex-col items-center justify-center px-6 py-12'>
      <div className='min-w-[304px] pb-12'>
        <Link href='/'>
          <Logo className='mx-auto h-[80px] w-[180px]' />
        </Link>
      </div>

      <div className='min-w-[304px]'>
        <Formik
          initialValues={{
            oldPassword: '',
            newPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className='space-y-4'>
              <div>
                <label
                  htmlFor='oldPassword'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  Current Password
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='password'
                    id='oldPassword'
                    name='oldPassword'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='oldPassword'
                    component='div'
                    className='text-xs text-red-600'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  New Password
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <div className='relative w-full'>
                    <Field
                      type={isShow ? 'text' : 'password'}
                      id='newPassword'
                      name='newPassword'
                      className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                    />
                    <div
                      className='absolute top-0 bottom-0 right-2 flex items-center justify-center'
                      onMouseDown={() => setIsShow(true)}
                      onMouseUp={() => setIsShow(false)}
                      onMouseLeave={() => setIsShow(false)}
                    >
                      {isShow ? <AiOutlineEyeInvisible className='text-white' /> : <AiOutlineEye className='text-white' />}
                    </div>
                  </div>
                  <ErrorMessage
                    name='newPassword'
                    component='div'
                    className='text-xs text-red-600'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  Confirm Password
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='confirmPassword'
                    component='div'
                    className='text-xs text-red-600'
                  />
                </div>
              </div>

              <div>
                <Button type='submit' disabled={loading} loading={loading}>
                  Confirm
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className='mt-10 flex items-center justify-center gap-2 text-center text-xs text-white'>
          Already updated?{' '}
          <Link
            href='/account/login'
            className='text-primary-100 hover:text-primary-100/50 font-semibold leading-6'
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Password;
