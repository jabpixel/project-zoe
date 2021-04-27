import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import XAvatar from "../../../components/XAvatar";
import { post, search } from "../../../utils/ajax";
import { remoteRoutes } from "../../../data/constants";
import Toast from "../../../utils/Toast";
import { IGroupMembership } from "../../groups/types";
import Loading from "../../../components/Loading";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

export interface IProps {
  groupId: string;
  eventId: string;
}

export interface IAttendance {
  id: string;
  groupId: string;
  eventId: string;
  contactId: string;
  contact: any;
  attended: boolean;
  isVisitor: boolean;
}

export const processData = (
  attendance: IAttendance[],
  memberships: IGroupMembership[],
  eventId: string
) => {
  const finalData: IAttendance[] = [...attendance];
  const atIds = attendance.map((it) => `${it.contactId}`);
  memberships.forEach(({ contactId, contact, groupId }) => {
    if (!atIds.includes(`${contactId}`)) {
      finalData.push({
        contactId,
        contact,
        groupId,
        id: "0",
        attended: false,
        eventId,
        isVisitor: false,
      });
    }
  });
  return finalData;
};

export default function EventAttendance({ eventId, groupId }: IProps) {
  const classes = useStyles();
  const [data, setData] = React.useState<IAttendance[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    search(
      remoteRoutes.eventsAttendance,
      { eventId, groupId },
      (resp) => {
        const { attendance, memberships } = resp;
        setData(processData(attendance, memberships, eventId));
      },
      undefined,
      () => {
        setLoading(false);
      }
    );
  }, [eventId, groupId]);

  const handleToggle = (contactId: string) => () => {
    let toUpdate = null;
    const updated: IAttendance[] = data.map((it) => {
      if (it.contactId === contactId) {
        toUpdate = { ...it, attended: !it.attended };
        return toUpdate;
      }
      return it;
    });
    post(
      remoteRoutes.eventsAttendance,
      toUpdate,
      (resp) => {
        setData(updated);
      },
      () => {
        Toast.error("Update failed");
      }
    );
  };

  const handleManualAdd = () => {};

  return (
    <Box>
      <List dense className={classes.root}>
        {loading ? (
          <Loading />
        ) : (
          data.map((it) => {
            return (
              <ListItem key={it.contactId} button>
                <ListItemAvatar>
                  <XAvatar value={it.contact.name} />
                </ListItemAvatar>
                <ListItemText id={it.id} primary={it.contact.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(it.contactId)}
                    checked={Boolean(it.attended)}
                    inputProps={{ "aria-labelledby": it.contact.name }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        )}
      </List>
      <Fab
        aria-label="Add new"
        className={classes.fab}
        color="primary"
        onClick={handleManualAdd}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
