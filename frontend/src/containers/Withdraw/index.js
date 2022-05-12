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

import {
	queryAPI
  } from '../../Api';

function Withdraw({username, userID, handleBalance, setLoadingFromChild}) {
    const [amountToWithdraw, setAmountToWithdraw] = React.useState('');

    const handleSubmit = (event) => { 
        event.preventDefault()
        setLoadingFromChild(true);
        console.log("amountToSend", amountToWithdraw)
        const withdraw_data = {
            "verb": "withdraw_money",
            "amount": parseInt(amountToWithdraw),
            "customer_name": username,
            "customer_id": userID
        }
        console.log("withdraw_data", withdraw_data)
        queryAPI('/withdraw',  withdraw_data, 'POST')
		.then(depRes => {
            if(depRes.length > 0) {
                const transaction_hash = depRes[0]['transaction_hash'];
                handleBalance()
                const update_hash_data = {
                    "customer_id": userID,
                    "last_amount": parseInt(amountToWithdraw),
                    "transaction_hash": transaction_hash,
                    "last_transaction_name": "withdraw"
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
                title="Withdraw"
                sx={{
                    bgcolor: "#696969",
                    color: "#FFFFFF"
                }}
            />
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        From account - {'nila'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="amount_to_withdraw"
                            label="Amount"
                            id="amount_to_withdraw"
                            value={amountToWithdraw}
                            type="number"
                            onChange={(e) => setAmountToWithdraw(e.target.value)}
                            autoComplete="amount_to_withdraw"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={'fullWidth'}
                            sx={{ mt: 2, mb: 2, bgcolor: '#40E0D0', float: "right" }}
                            disabled={false}
                        >
                            Withdraw
                        </Button>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

Withdraw.propTypes = {
	username: PropTypes.string,
    userID: PropTypes.string,
    handleBalance: PropTypes.func,
    setLoadingFromChild: PropTypes.func,
}

export default Withdraw;