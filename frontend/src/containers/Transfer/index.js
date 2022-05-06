import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';

function Transfer() {
    const [toAccount, setToAccount] = React.useState('');
    const [amountToSend, setAmountToSend] = React.useState('');
    const handleSubmit = (event) => { 
        event.preventDefault()
        console.log({
            "toAccount": toAccount,
            "amountToSend": amountToSend
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
                    <Typography gutterBottom variant="h5" component="div">
                        From account - {'nila'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>
                        <TextField
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
                        />
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
export default Transfer;