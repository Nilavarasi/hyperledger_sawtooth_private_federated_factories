import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Chip from '@mui/material/Chip';
import Deposit from '../../containers/Deposit';
import Transfer from '../../containers/Transfer';
import Withdraw from '../../containers/Withdraw';
import Transactions from '../../containers/Transactions'

const divStyle = {
	display: 'flex',
	alignItems: 'center'
  };

function Home() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Transfer" value="1" />
            <Tab label="Deposit" value="2" />
            <Tab label="Withdraw" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
			<Chip style={{float: 'right'}} label="Balance: 500" color="success" />
			<br />
			<div style={divStyle}>
				<Transfer />
				<Transactions />
			</div>
			
		</TabPanel>
        <TabPanel value="2">
			<Chip style={{float: 'right'}} label="Balance: 500" color="success" />
			<br />
			<div style={divStyle}>
				<Deposit />
				<Transactions />
			</div>
		</TabPanel>
        <TabPanel value="3">
			<Chip style={{float: 'right'}} label="Balance: 500" color="success" />
			<br />
			<div style={divStyle}>
				<Withdraw />
				<Transactions />
			</div>
		</TabPanel>
      </TabContext>
    </Box>
  );
}

export default Home;