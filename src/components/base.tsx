import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { WagmiConfig } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

import LoadingIndicator from '@/components/common/loadingIndicator';
import Layout from '@/components/layout';

import { chains, wagmiConfig } from '@/configs/wagmiConfig';
import AuthProvider from '@/providers/authProvider';
import store from '@/services';

export interface IBaseProps {
  title?: string;
  description?: string | null;
}

function Base<P>({
  Component,
  pageProps,
}: {
  Component: typeof React.Component;
  pageProps: P & IBaseProps;
}): JSX.Element {
  const { description, title } = pageProps;

  return (
    <React.StrictMode>
      <Head>
        <title>{`${title ? `${title} | ` : ''} Copy Trader`}</title>
        {description && <meta name='description' content={description} />}
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
        />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      </Head>
      <LoadingIndicator />
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          appInfo={{
            appName: 'Copy Trader',
            learnMoreUrl: '',
          }}
          chains={chains}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: '#0171D9',
            accentColorForeground: 'white',
            borderRadius: 'small',
            overlayBlur: 'small',
          })}
          modalSize='compact'
        >
          <SnackbarProvider
            preventDuplicate
            autoHideDuration={2000}
            dense
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <StoreProvider store={store}>
              <AuthProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </AuthProvider>
            </StoreProvider>
          </SnackbarProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>
  );
}

export default Base;
