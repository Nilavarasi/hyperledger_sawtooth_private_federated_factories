import * as React from 'react';
import { Redirect } from "react-router-dom";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Deposit from '../../containers/Deposit';
import Transfer from '../../containers/Transfer';
import Withdraw from '../../containers/Withdraw';
import Transactions from '../../containers/Transactions'
import Account from '../../containers/Account';
import LogoutIcon from '@mui/icons-material/Logout';

import {
	queryAPI
} from '../../Api';

const divStyle = {
	display: 'flex',
	alignItems: 'center'
};

	// const getFullDate = (timestamp) => {
	//     const date = new Date(timestamp);
	//     return date.getDate()+
	//     "/"+(date.getMonth()+1)+
	//     "/"+date.getFullYear()+
	//     " "+date.getHours()+
	//     ":"+date.getMinutes()+
	//     ":"+date.getSeconds();
	// }

function Home() {
	const [value, setValue] = React.useState('1');
	const [balance, setBalance] = React.useState(0);
	const [username, setUsername] = React.useState('');
	const [userID, setUserID] = React.useState('');
	const [userBank, setUserBank] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [transactions, setTransactions] = React.useState([]);
	const [isLoggedOutClicked, clickLoggedOut] = React.useState(false);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleBalance = () => {
		updateCustomer(username);
		getTransactions(username, userID);
	}

	const setLoadingFromChild = (value) => {
		setIsLoading(value)
	}

	const updateCustomer = (customer_name) => {
		queryAPI('/user', { 'customer_name': customer_name }, 'POST')
			.then(userRes => {
				if (userRes[0].message.length > 0) {
					const userBalance = userRes[0].message[0]['balance'];
					setBalance(userBalance)
					const userBank = userRes[0].message[0]['bank_name']
					setUserBank(userBank);
					const userID = userRes[0].message[0]['customer_id']
					setUserID(userID);
					const customerName = userRes[0].message[0]['customer_name']
					setUsername(customerName)
					console.log("userRes[0].message[0]", userRes[0].message[0])
					localStorage.setItem('sec_user_balance', userBalance);
					localStorage.setItem('sec_user_bank_name', userBank);
					localStorage.setItem('sec_user_customer_id', userID);
					localStorage.setItem('sec_user_customer_name', customerName);
					localStorage.setItem('sec_user_public_key', userRes[0].message[0]['public_key']);
				}
			})
	}

	const getTransactions = (customer_name, customer_id) => {
		const transactionQueryData = { "customer_name": customer_name, "customer_id": customer_id }
		queryAPI('/transactions', transactionQueryData, 'POST')
			.then(transacRes => {
				if (transacRes.length > 0) {
					const transactions = transacRes[0]['message']
					// transactions.map((transaction, index) => {
					// 	transactions[index]['created_at'] = getFullDate(transactions[index]['created_at'] )
					// })
					console.log("transactions before", transactions)
					transactions.sort(function(a,b){
						return new Date(b) - new Date(a);
					});
					console.log("transactions later", transactions)
					setTransactions(transactions)
					console.log("transacRes", transacRes)
					console.log('transactions', transactions)
				}
			})
	}

	React.useEffect(() => {
		const customer_name = localStorage.getItem('sec_user_customer_name')
		const customer_id = localStorage.getItem('sec_user_customer_id')
		setIsLoading(true);
		if (customer_name) {
			updateCustomer(customer_name)
			getTransactions(customer_name, customer_id)
			setIsLoading(false);
		}
	}, [])

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			{
				isLoading ?
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<CircularProgress />
					</Box> :
					<TabContext value={value}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

							<TabList onChange={handleChange} aria-label="lab API tabs example">
								<Tab label="Account" value="1" />
								<Tab label="Deposit" value="2" />
								<Tab label="Withdraw" value="3" />
								<Tab label="Transfer" value="4" />
								<Tab icon={<LogoutIcon />} aria-label="person" onClick={() => clickLoggedOut(true)}/>
							</TabList>
						</Box>
						<TabPanel value="4">
							<Chip style={{ float: 'right' }} label={`Balance: ${balance || 0}`} color="success" />
							<br />
							<div style={divStyle}>
								<Transfer
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									handleBalance={handleBalance}
									setLoadingFromChild={setLoadingFromChild}
								/>
								<Transactions
									transactions={transactions}
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									setLoadingFromChild={setLoadingFromChild}
								/>
							</div>

						</TabPanel>
						<TabPanel value="2">
							<Chip style={{ float: 'right' }} label={`Balance: ${balance || 0}`} color="success" />
							<br />
							<div style={divStyle}>
								<Deposit
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									handleBalance={handleBalance}
									setLoadingFromChild={setLoadingFromChild}
								/>
								<Transactions
									transactions={transactions}
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									setLoadingFromChild={setLoadingFromChild}
								/>
							</div>
						</TabPanel>
						<TabPanel value="3">
							<Chip style={{ float: 'right' }} label={`Balance: ${balance || 0}`} color="success" />
							<br />
							<div style={divStyle}>
								<Withdraw
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									handleBalance={handleBalance}
									setLoadingFromChild={setLoadingFromChild}
								/>
								<Transactions
									transactions={transactions}
									balance={balance}
									username={username}
									userID={userID}
									userBank={userBank}
									setLoadingFromChild={setLoadingFromChild}
								/>
							</div>
						</TabPanel>
						<TabPanel value="1">
							<Account
							balance={balance}
							username={username}
							userID={userID}
							userBank={userBank}/>
						</TabPanel>
						{
							isLoggedOutClicked &&
							<Redirect from="/" to= "/login" />
						}
					</TabContext>
			}

		</Box>
	);
}

export default Home;