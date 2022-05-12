import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import {
	queryAPI
} from '../../Api';

function Transfer({username, userID, handleBalance, setLoadingFromChild}) {
    const [toAccount, setToAccount] = React.useState('');
    // const [toCustomerID, setToCustomer] = React.useState('');
    const [amountToSend, setAmountToSend] = React.useState('');
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        queryAPI('/users', {}, 'POST')
        .then(transacRes => {
            if(transacRes.length > 0) {
                setUsers(transacRes[0]['message'])
            }
        })
    }, [])

    // const handleChange = (value) => {
        // setToAccount(value)
        // setToCustomer(users.filter(user => user['customer_name'] === toAccount)[0]['customer_id']);
    // }
    const handleSubmit = (event) => { 
        event.preventDefault()
        console.log({
            "toAccount": toAccount,
            "amountToSend": amountToSend
        })
        
        setLoadingFromChild(true);
        console.log("amountToSend", amountToSend)
        const transfer_data = {
            "verb": "transfer_money",
            "amount": parseInt(amountToSend),
            "dest_customer_id": users.filter(user => user['customer_name'] === toAccount)[0]['customer_id'],
            "source_customer_id": userID,
            "source_customer_name": username,
            "dest_customer_name": toAccount
        }
        console.log("transfer_data", transfer_data)
        queryAPI('/transfer',  transfer_data, 'POST')
		.then(transRes => {
            if(transRes.length > 0) {
                const transaction_hash = transRes[0]['transaction_hash'];
                handleBalance()
                const update_hash_data = {
                    "customer_id": userID,
                    "last_amount": parseInt(amountToSend),
                    "transaction_hash": transaction_hash,
                    "last_transaction_name": "transfer"
                }
                queryAPI('/update_hash',  update_hash_data, 'POST')
                .then(updateDepRes => {
                    console.log(updateDepRes)
                    setLoadingFromChild(false);
                    handleBalance()
                })
            }
        })

    }
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title="Transfer"
                sx={{
                    bgcolor: "#696969",
                    color: "#FFFFFF"
                }}
            />
            <CardActionArea>
                <CardContent>
                    {console.log("users", users)}

                    <Typography gutterBottom variant="h5" component="div">
                        From account - {'nila'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">To Account</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={toAccount}
                            label="To Account"
                            name="user name"
                            onChange={(event) => setToAccount(event.target.value)}
                        >
                            {
                                users.map((user, index) => (
                                    <MenuItem id={user['customer_name']} key={`user_index${index}`} value={user['customer_name']}>{user['customer_name']}</MenuItem>        
                                ))
                            }
                        </Select>
                    </FormControl>
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="to_acconunt"
                            label="Receiver Account"
                            name="to_acconunt"
                            autoComplete="to_acconunt"
                            value={toAccount}
                            onChange={(e) => setToAccount(e.target.value)}
                            autoFocus
                        /> */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="amount_to_send"
                            label="Amount"
                            id="amount_to_send"
                            type="number"
                            value={amountToSend}
                            onChange={(e) => setAmountToSend(e.target.value)}
                            autoComplete="amount_to_send"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={'fullWidth'}
                            sx={{ mt: 2, mb: 2, bgcolor: '#40E0D0', float: "right" }}
                            disabled={false}
                        >
                            Transfer
                        </Button>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

Transfer.propTypes = {
	username: PropTypes.string,
    userID: PropTypes.string,
    handleBalance: PropTypes.func,
    setLoadingFromChild: PropTypes.func,
}
export default Transfer;