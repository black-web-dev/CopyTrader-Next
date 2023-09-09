import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import * as Yup from 'yup';

import useNotification from '@/hooks/useNotification';

import { useAppDispatch } from '@/services';
import { checkEmailAsync, signupAsync } from '@/services/auth';
import { shortAddress, verifyToken } from '@/utils';

import Button from '../common/button';

import Logo from '~/svg/logo_footer.svg';

interface FormValues {
  email: string;
  firstName: string;
  lastName: string;
  twitter_link: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register = (): JSX.Element => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  const [referralCode, setReferralCode] = useState<string>('');

  // Initialize a state to track the email value
  const [emailValue, setEmailValue] = useState<string>('');
  const [checkingEmailStatus, setCheckingEmailStatus] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaSuccess, setCaptchaSuccess] = useState<boolean>(true);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const validationSchema: Yup.Schema<FormValues> = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .matches(emailRegex, 'Invalid email format')
      .test(
        'email-availability',
        'Email is already in use',
        async function (value) {
          if (!value) return true; // Skip validation if no email provided

          // Skip checking availability if the email format is invalid
          if (!emailRegex.test(value)) {
            return true;
          }

          setEmailValue(value); // Update the tracked email value

          // Check if the email value has changed
          if (value === emailValue) {
            return checkingEmailStatus; // Skip async validation for now
          }

          try {
            setCheckingEmail(true);
            const response: any = await dispatch(
              checkEmailAsync({ email: value })
            );
            setCheckingEmail(false);
            const hasCreated = response.payload.data.hasCreated as boolean;

            setCheckingEmailStatus(!hasCreated);

            return !hasCreated;
          } catch (error) {
            setCheckingEmail(false);
            console.error('Error checking email availability:', error);
            return false;
          }
        }
      ),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    twitter_link: Yup.string().required('Twitter link is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const handleSubmit = async (value: FormValues) => {
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

    dispatch(signupAsync({ ...value, invite_code: referralCode })).then(
      (payload: any) => {
        setLoading(false);
        if (payload?.error) return;
        notification('You have successfully logged in.', 'success');

        router.push('/');
      }
    );
  };

  const onChange = (value: any) => {
    setCaptchaToken(value);
    setCaptchaSuccess(true);
  };

  useEffect(() => {
    const refferedCode = router.query.referred as string;

    if (refferedCode) {
      setReferralCode(refferedCode);
      notification('You invited to CopyTrader', 'success');
    }
  }, [router, notification]);

  return (
    <div className='bg-back-100 flex min-h-screen min-w-[304px] flex-col items-center justify-center px-6 py-12'>
      <div className='min-w-[304px] pb-12'>
        <Link href='/'>
          <Logo className='mx-auto h-[80px] w-[180px]' />
        </Link>
      </div>

      <div className='min-w-[304px]'>
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            twitter_link: '',
            password: '',
            confirmPassword: '',
            role: 'user',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, values }) => (
            <Form className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  Email *
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='text'
                    id='email'
                    name='email'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  {checkingEmail && (
                    <div className='text-text-100 text-xs'>
                      Checking email availability...
                    </div>
                  )}
                  {!errors.email && values.email && !checkingEmail && (
                    <div className='flex items-center gap-1 text-xs text-green-500'>
                      <AiOutlineCheckCircle />
                      Email is available!
                    </div>
                  )}
                  {errors.email && values.email && !checkingEmail && (
                    <div className='flex items-center gap-1 text-xs text-red-500'>
                      <BiErrorCircle />
                      {errors.email}
                    </div>
                  )}
                  {errors.email && !values.email && !checkingEmail && (
                    <ErrorMessage
                      name='email'
                      component='div'
                      className='text-xs text-red-600'
                    />
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  First Name
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='text'
                    id='firstName'
                    name='firstName'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='firstName'
                    component='div'
                    className='text-xs text-red-600'
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
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='text'
                    id='lastName'
                    name='lastName'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='lastName'
                    component='div'
                    className='text-xs text-red-600'
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='twitter_link'
                  className='block text-sm font-normal leading-6 text-white'
                >
                  Twitter Link
                </label>
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='text'
                    id='twitter_link'
                    name='twitter_link'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='twitter_link'
                    component='div'
                    className='text-xs text-red-600'
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
                <div className='mt-2 flex flex-col items-start gap-2'>
                  <Field
                    type='password'
                    id='password'
                    name='password'
                    className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='password'
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

              {referralCode && (
                <div className='flex flex-col gap-2'>
                  <label className='text-text-200 text-sm capitalize'>
                    Referral Code
                  </label>
                  <div className='text-text-200 relative flex items-center rounded bg-white/5 px-3 py-2'>
                    <div className='flex-auto'>
                      {shortAddress(referralCode)}
                    </div>
                  </div>
                </div>
              )}

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
                  Sign up
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <p className='mt-10 flex items-center justify-center gap-2 text-center text-xs text-white'>
          Already registered?{' '}
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

export default Register;
