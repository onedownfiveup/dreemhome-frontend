import React, { useState, FunctionComponent } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import { notificationStyles } from '@dreemhome/components/shared/Notification.styles'

interface NotificationProps {
  open: boolean
  children: any
}

const Notification: FunctionComponent<NotificationProps> = ({ open, children }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [vertical, horizontal] = ['top', 'center']
  const classes = notificationStyles()

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key={`${vertical},${horizontal}`}
        open={isOpen}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{children}</span>}
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
      />
    </div>
  );
}

export default Notification
