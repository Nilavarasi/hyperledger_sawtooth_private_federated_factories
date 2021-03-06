import * as React from 'react';
import { Redirect } from 'react-router-dom';
import Avatar from "@material-ui/core/Avatar";
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
    queryAPI
  } from '../../Api';

import {
    Notification
} from '../../components/Notification';

const useStyles = makeStyles(theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));



export default function RegisterForm() {
    const [isUserCreated, setIsUserCreated] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false);
    const [bank, setBank] = React.useState('Bank 1');

    const handleChange = (event) => {
        setBank(event.target.value);
    };
    const [isSuccessRegister, setIsSuccessRegister] = React.useState(false);

    const handleSubmit = (event) => {
        setIsLoading(true)
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const customer_name = data.get('firstName') + ' ' + data.get('lastName');
        console.log("data", data);
        // eslint-disable-next-line no-console
        const user_data = {
            email: data.get('email'),
            customer_name: customer_name,
            first_name: data.get('firstName'),
            last_name: data.get('lastName'),
            password: data.get('password'),
            bank_name: data.get('bank_name'),
            verb: "create_account"
        }
        queryAPI('/signup', user_data, 'POST')
        .then(payload => {
            setTimeout(() => {
                setIsSuccessRegister(true)
                setIsLoading(false)
                setIsUserCreated(true)
            }, 200)
        })
    };
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {isSuccessRegister &&
                <Notification isOpen={true} severity="success" message={"Successfully Registered"} />
            }
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="retype_password"
                                label="Retype password"
                                type="retype_password"
                                id="retype_password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">bank</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={bank}
                                    label="bank"
                                    name="bank_name"
                                    onChange={handleChange}
                                    defaultValue={'Bank 1'}
                                >
                                    <MenuItem value={'bank_1'}>Bank 1</MenuItem>
                                    <MenuItem value={'bank_2'}>Bank 2</MenuItem>
                                    <MenuItem value={'bank_3'}>Bank 3</MenuItem>
                                    <MenuItem value={'bank_4'}>Bank 4</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                    </Grid>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        loading={isLoading}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </LoadingButton>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
            {
                isUserCreated &&
                <Redirect to='/login' />
            }
        </Container>
    );
}
