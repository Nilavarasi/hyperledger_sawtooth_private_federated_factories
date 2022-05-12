import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Redirect } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  queryAPI
} from '../../Api';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Nila - Small Bank Hyperledger Sawtooth Application
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LoginForm() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    // const [isLoading, setIsLoading] = React.useState(false)
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    const user_data = {
        customer_name: data.get('email'),
        password: data.get('password'),
      }
    queryAPI('/login', user_data, 'POST')
      .then(loginRes => {
        queryAPI('/user', {'customer_name': data.get('email')}, 'POST')
        .then(userRes => {
          console.log('userRes', userRes)
          if(userRes[0].message.length > 0) {
            console.log("userRes[0].message[0]", userRes[0].message[0])
            localStorage.setItem('sec_user_balance', userRes[0].message[0]['balance']);
            localStorage.setItem('sec_user_bank_name', userRes[0].message[0]['bank_name']);
            localStorage.setItem('sec_user_customer_id', userRes[0].message[0]['customer_id']);
            localStorage.setItem('sec_user_customer_name', userRes[0].message[0]['customer_name']);
            localStorage.setItem('sec_user_public_key', userRes[0].message[0]['public_key']);
            setIsLoggedIn(true)
            // setIsLoading(false)
          }
        })
      })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          {
            console.log("isLoggedIn", isLoggedIn)
          }
        </Box>
        {
          isLoggedIn && <Redirect to='/home' />
        }
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}