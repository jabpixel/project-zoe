import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import { hasValue } from '../../../../components/inputs/sutils';
import { IContact, renderName } from '../../types';

interface IProps {
  data: IContact;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      borderRadius: 0,
    },

    image: {
      height: 50,
      width: 50,
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    nameHolder: {
      paddingTop: theme.spacing(1),
    },
  }),
);

const Profile = ({ data }: IProps) => {
  const classes = useStyles();
  const hasAvatar = hasValue(data.person.avatar);
  return (
    <Grid container justify="flex-start" alignItems="flex-start">
      {hasAvatar ? (
        <Avatar
          alt="Avatar"
          src={data.person.avatar}
          className={classes.image}
        />
      ) : (
        <Avatar className={classes.image}>
          <PersonIcon fontSize="large" />
        </Avatar>
      )}
      <Grid item className={classes.nameHolder}>
        <Typography variant="h6">{renderName(data.person)}</Typography>
        <Typography variant="body2">{data.category}</Typography>
      </Grid>
    </Grid>
  );
};

export default Profile;
