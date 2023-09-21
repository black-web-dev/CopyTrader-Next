import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import useNotification from '@/hooks/useNotification';

import Loader from '@/components/common/loader';

import { useAppDispatch } from '@/services';
import { checkEmailAsync, selectUserdata } from '@/services/auth';
import {
  getInvitedListAsync,
  selectInvitations,
  selectIsSending,
  sendInviteAsync,
} from '@/services/referral';
import { InviteDetailType } from '@/services/referral/referral.api';
import { verifyToken } from '@/utils';

const DirectInvite = (): JSX.Element => {
  const user = useSelector(selectUserdata);
  const invitations = useSelector(selectInvitations);
  const isSending = useSelector(selectIsSending);

  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  // Initialize a state to track the email value
  const [emailValue, setEmailValue] = useState<string>('');
  const [checkingEmailStatus, setCheckingEmailStatus] =
    useState<boolean>(false);

  const captchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = React.useState(null);
  const [captchaSuccess, setCaptchaSuccess] = React.useState<boolean>(true);

  const dispatch = useAppDispatch();
  const notification = useNotification();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const validationSchema: Yup.Schema<InviteDetailType> = Yup.object().shape({
    user_id: Yup.number().required('User is required'),
    invite_email: Yup.string()
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
    sector: Yup.string(),
    company: Yup.string(),
  });

  const onChange = (value: any) => {
    console.log('Captcha value:', value);
    setCaptchaToken(value);
    setCaptchaSuccess(true);
  };

  const handleSubmit = useCallback(
    async (value: InviteDetailType) => {
      if (user.role === 'user' && invitations.count === 10) return;

      if (isSending) return;

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

      dispatch(sendInviteAsync(value)).then((payload: any) => {
        if (payload?.error) return;
        notification('Sent invitation', 'success');
        dispatch(getInvitedListAsync({ user_id: user.id }));
      });
    },
    [
      user.role,
      user.id,
      invitations.count,
      isSending,
      captchaToken,
      dispatch,
      notification,
    ]
  );

  return (
    <div className='flex flex-col rounded bg-[#14161D] p-2 md:px-[29px] md:py-[23px]'>
      <div className='mb-[13px] flex items-center gap-4'>
        <div className='text-text-100'>Direct Invites</div>
        <div className='text-[#3AB275]'>
          {user?.role === 'admin'
            ? `${invitations.count} Sent`
            : `${10 - invitations.count} Remaining`}
        </div>
      </div>
      <Formik
        initialValues={{
          user_id: user.id | 0,
          invite_email: '',
          firstName: '',
          lastName: '',
          sector: '',
          company: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, values }) => (
          <Form className='space-y-4'>
            <div>
              <label
                htmlFor='invite_email'
                className='block text-sm font-normal leading-6 text-white'
              >
                Email *
              </label>
              <div className='mt-2 flex flex-col items-start gap-2'>
                <Field
                  type='text'
                  id='invite_email'
                  name='invite_email'
                  className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                />
                {checkingEmail && (
                  <div className='text-text-100 text-xs'>
                    Checking email availability...
                  </div>
                )}
                {!errors.invite_email &&
                  values.invite_email &&
                  !checkingEmail && (
                    <div className='flex items-center gap-1 text-xs text-green-500'>
                      <AiOutlineCheckCircle />
                      Email is available!
                    </div>
                  )}
                {errors.invite_email &&
                  values.invite_email &&
                  !checkingEmail && (
                    <div className='flex items-center gap-1 text-xs text-red-500'>
                      <BiErrorCircle />
                      {errors.invite_email}
                    </div>
                  )}
                {errors.invite_email &&
                  !values.invite_email &&
                  !checkingEmail && (
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
                htmlFor='sector'
                className='block text-sm font-normal leading-6 text-white'
              >
                Sector ( Optional )
              </label>
              <div className='mt-2 flex flex-col items-start gap-2'>
                <Field
                  type='text'
                  id='sector'
                  name='sector'
                  className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                />
                <ErrorMessage
                  name='sector'
                  component='div'
                  className='text-xs text-red-600'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='company'
                className='block text-sm font-normal leading-6 text-white'
              >
                Company ( Optional )
              </label>
              <div className='mt-2 flex flex-col items-start gap-2'>
                <Field
                  type='text'
                  id='company'
                  name='company'
                  className='focus:shadow-inputFocus block w-full rounded border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0 focus:ring-0 sm:text-sm sm:leading-6'
                />
                <ErrorMessage
                  name='company'
                  component='div'
                  className='text-xs text-red-600'
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
              <button
                type='submit'
                className='bg-primary-100 hover:bg-primary-100/50 flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95'
                disabled={isSending}
              >
                {isSending && <Loader />}
                Send Invite
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DirectInvite;
