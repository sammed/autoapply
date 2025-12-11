import LoginForm from '../components/LoginForm';
import { Box } from '@mui/material';


export default function Login() {
  return (
      <Box className="flex justify-center items-center h-screen">
        <LoginForm />
      </Box>
  );
}