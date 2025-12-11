import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, register } from '../utils/auth';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success;
    if (isLogin) {
      success = await login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        alert('Login failed');
      }
    } else {
      success = await register(username, password);
      if (success) {
        alert('Registration successful. Please log in.');
        setIsLogin(true);
      } else {
        alert('Registration failed');
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            color="primary"
            value={isLogin}
            exclusive
            onChange={(_, newValue) => setIsLogin(newValue)}
            aria-label="Auth mode"
          >
            <ToggleButton value={true}>Sign In</ToggleButton>
            <ToggleButton value={false}>Sign Up</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}