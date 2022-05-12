import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export function Notification({ isOpen, message, severity }) {
	const [open, setOpen] = React.useState(isOpen);
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<React.Fragment>
			<Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
					{message}
				</Alert>
			</Snackbar>
		</React.Fragment>
	);
}

Notification.propTypes = {
	isOpen: PropTypes.bool,
	message: PropTypes.string,
	severity: PropTypes.string,
};
