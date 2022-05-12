import * as React from 'react';
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { CardActionArea } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// function createData(name, value) {
//     return { name, value };
// }

function Account({ username, userID, balance, userBank }) {

    const rows = [
       {"name": "Username", "value": username},
       {"name": "Public Key", "value":  userID},
       {"name": "Current Balance", "value":  balance},
       {"name": "Bank", "value":  userBank}
      ];
    return (
        <Card sx={{ maxWidth: 900 }}>
            <CardHeader
                title="Account Details"
                sx={{
                    bgcolor: "#696969",
                    color: "#FFFFFF"
                }}
            />
            <CardActionArea>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            {/* <TableHead>
                                <TableRow>
                                    <TableCell>Dessert (100g serving)</TableCell>
                                    <TableCell align="right">Calories</TableCell>
                                </TableRow>
                            </TableHead> */}
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

Account.propTypes = {
    username: PropTypes.string,
    userID: PropTypes.string,
    userBank: PropTypes.string,
    balance: PropTypes.string,
}
export default Account;