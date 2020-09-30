import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {ExitToApp as ExitToAppIcon} from '@material-ui/icons';
import useUser from '../hooks/useUser';

interface Props extends RouteComponentProps<{}> {}

function LogoutListItem(props: Props) {
  const { logout } = useUser();

  return (
    <ListItem
      button
      onClick={async () => {
        await logout();
        props.history.push("/login")
      }}
    >
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary={"ログアウト"} />
    </ListItem>
  );
}

export default withRouter(LogoutListItem);