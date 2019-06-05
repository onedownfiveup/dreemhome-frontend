import React, { useState, FunctionComponent } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloseIcon from '@material-ui/icons/Close'
import { notificationStyles } from '@dreemhome/components/shared/Notification.styles'

interface NotificationProps {
  open: boolean
  children: any
  handleCloseCallback: () => void
}

const Notification: FunctionComponent<NotificationProps> = ({ open, children, handleCloseCallback }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [vertical, horizontal] = ['top', 'center']
  const classes = notificationStyles()

  const handleClose = () => {
    setIsOpen(false);
    handleCloseCallback()
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key={`${vertical},${horizontal}`}
        open={isOpen}
        onClose={handleClose}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
            data-testid="notification-close-button"
          >
            <CloseIcon />
          </IconButton>
        ]}
      >
        <SnackbarContent
          className={classes['error']}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              {children}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={handleClose} data-testid="notification-close-button">
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
}

export default Notification
