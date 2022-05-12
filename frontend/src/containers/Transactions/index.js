import * as React from 'react';
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { green, red } from '@mui/material/colors';


const hash = "2b1b5e4dd013d63aae7802872b2a067fdd48069fc0d31dd72a28c45bfe5946b05cc42797cf6f2c69dd48acd5918b992f25d7e044da52bbd9e06e1ce20a354055";
const getFullDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.getDate() +
        "/" + (date.getMonth() + 1) +
        "/" + date.getFullYear() +
        " " + date.getHours() +
        ":" + date.getMinutes() +
        ":" + date.getSeconds();
}
function Transactions({ transactions, userID }) {
    return (
        <Card sx={{ maxWidth: 700, ml: '80px', maxHeight: 300, overflow: 'auto' }}>
            {/* <CardHeader
                title="Transactions"
                sx={{
                    bgcolor: "#696969",
                    color: "#FFFFFF"
                }}
            /> */}
            <CardActionArea>
                <CardContent>
                    {console.log("transactions", transactions)}
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {transactions.map((transaction, index) => (
                            <React.Fragment key={index}>
                                <ListItem key={`list_item_${index}`} alignItems="flex-start">
                                    <ListItemAvatar key={`list_item_avatar_${index}`} >
                                        <Avatar sx={{ bgcolor: transaction['transaction_name'] === 'deposit' ? green[500] : 
                                        transaction['transaction_name'] === 'transfer' && transaction['dest_account'] === userID ? green[500]:
                                        red[500] }}>
                                            {
                                                transaction['transaction_name'] === 'transfer' && transaction['dest_account'] === userID ?
                                                    <CallReceivedIcon />
                                                    : transaction['transaction_name'] === 'transfer' ?
                                                        <CallMadeIcon />
                                                        : transaction['transaction_name'] === 'withdraw' ?
                                                            <ArrowForwardIcon />
                                                            : <CallReceivedIcon />
                                            }

                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        key={`list_item_text_${index}`}
                                        primary={transaction['transaction_name'].charAt(0).toUpperCase()+transaction['transaction_name'].slice(1)}
                                        secondary={
                                            transaction['transaction_name'] === 'transfer' ?
                                                <React.Fragment>

                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        From {transaction['customer_name']}
                                                    </Typography>
                                                    <br />{` To: ${transaction['dest_customer_name']} `} <br />
                                                    {` Amount: ${transaction['amount']} `} <br />
                                                    {`Date: ${getFullDate(parseFloat(transaction['created_at']))}`} <br />
                                                    {`Transaction Hash: ${transaction['transaction_hash'] || hash}`}

                                                </React.Fragment>
                                                : transaction['transaction_name'] === 'withdraw' ?
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            By {transaction['customer_name']}
                                                        </Typography><br />
                                                        {` Amount: ${transaction['amount']} `} <br />
                                                        {`Date: ${getFullDate(parseFloat(transaction['created_at']))}`} <br />
                                                        {`Transaction Hash: ${transaction['transaction_hash'] || hash}`}
                                                    </React.Fragment>
                                                    :
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            By {transaction['customer_name']}
                                                        </Typography><br />
                                                        {` Amount: ${transaction['amount']} `} <br />
                                                        {`Date: ${getFullDate(parseFloat(transaction['created_at']))}`} <br />
                                                        {`Transaction Hash: ${transaction['transaction_hash'] || hash}`}
                                                    </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

Transactions.propTypes = {
    transactions: PropTypes.array,
    userID: PropTypes.string
}

export default Transactions;