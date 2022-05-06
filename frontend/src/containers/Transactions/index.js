import * as React from 'react';
import Card from '@mui/material/Card';
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

function Transactions() {

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
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }}>
                                    <CallMadeIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Transfer"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            From Nila
                                        </Typography>
                                        {" — To: A, Amount: 100, Date: 12/2/2021"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: red[500] }}>
                                    <ArrowForwardIcon    />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Withdraw"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            By Nila
                                        </Typography>
                                        {" — Amount: 100, Date : 12/2/2022"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: green[500] }}>
                                    <CallReceivedIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Deposit"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            By Nila
                                        </Typography>
                                        {' — Amount: 300, Date: 14/2/2022'}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
export default Transactions;