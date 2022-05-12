import * as React from 'react';
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';

import {
	queryAPI
  } from '../../Api';

function Deposit({username, userID, handleBalance, setLoadingFromChild}) {
    const [amountToSend, setAmountToSend] = React.useState('');

    const handleSubmit = (event) => { 
        event.preventDefault()
        setLoadingFromChild(true);
        console.log("amountToSend", amountToSend)
        const deposit_data = {
            "verb": "deposit_money",
            "amount": parseInt(amountToSend),
            "customer_name": username,
            "customer_id": userID
        }
        console.log("deposit_data", deposit_data)
        queryAPI('/deposit',  deposit_data, 'POST')
		.then(depRes => {
            if(depRes.length > 0) {
                const transaction_hash = depRes[0]['transaction_hash'];
                handleBalance()
                const update_hash_data = {
                    "customer_id": userID,
                    "last_amount": parseInt(amountToSend),
                    "transaction_hash": transaction_hash,
                    "last_transaction_name": "deposit"
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
        <Card sx={{ maxWidth: 500 }}>
            <CardHeader
                title="Deposit"
                sx={{
                    bgcolor: "#696969",
                    color: "#FFFFFF"
                }}
            />
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        From account - {username}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="amount_to_send"
                            label="Amount"
                            id="amount_to_send"
                            value={amountToSend}
                            type="number"
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
                            Deposit
                        </Button>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

Deposit.propTypes = {
	username: PropTypes.string,
    userID: PropTypes.string,
    handleBalance: PropTypes.func,
    setLoadingFromChild: PropTypes.func,
}
export default Deposit;