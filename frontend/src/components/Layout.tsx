import Head from 'next/head';
import { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
} from '@mui/material';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Head>
          <title>Job Applications Dashboard</title>
          <link rel="icon" href="/assets/logo1.svg" />
        </Head>

        {/* Header */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}   
          sx={{
            backgroundColor: '#1f2937',
            color: '#ffffff',
            borderBottom: '1px solid #4b5563',
          }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <img
                src="/assets/logo1.svg"
                alt="Logo"
                style={{ height: 32, marginRight: 10 }}
              />
              <Link href="/dashboard" passHref>
                <Typography
                  variant="button"
                  sx={{ ml: 2, textDecoration: 'none', cursor: 'pointer' }}
                >
                  Dashboard
                </Typography>
              </Link>
            </Box>
            <Avatar
              alt="User"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              sx={{ ml: 1 }}
            />
          </Toolbar>
        </AppBar>

        {/* Main content */}
        <Container
          component="main"
          sx={{
            flexGrow: 1,
            mt: 3,
            mb: 3,
          }}
        >
          {children}
        </Container>

        {/* Footer */}
        <AppBar
          position="static"
          color="default"
          elevation={0}
          component="footer"
        >
          <Box sx={{ py: 3 }}>
            <Typography variant="body2" color="textSecondary" align="center">
              © 2024 Job Applications Dashboard. All rights reserved.
            </Typography>
          </Box>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
