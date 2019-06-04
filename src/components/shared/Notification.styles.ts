import { makeStyles, Theme } from '@material-ui/core/styles';

export const notificationStyles = makeStyles((theme: Theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));
