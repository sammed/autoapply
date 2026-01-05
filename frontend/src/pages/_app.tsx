import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../styles/theme';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Job Auto Apply</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;