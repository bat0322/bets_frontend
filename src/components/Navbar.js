import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';



const Navbar = (props) => {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  const clickAction = () => {
    sessionStorage.clear();
    props.history.push('/login');
  }
  if (!isAdmin)
    return (
      <Menu fixed='top' inverted>
        <Menu.Item as={Link} to='/'>Home</Menu.Item>
        <Menu.Item as={Link} to='/profile/user'>Profile</Menu.Item>
        <Menu.Item as={Link} to='/bets/user'>My Bets</Menu.Item>
        <Menu.Item as='a' onClick={clickAction}>Sign Out</Menu.Item>
      </Menu>
    )
  else
    return (
      <Menu fixed='top' inverted>
        <Menu.Item as={Link} to='/'>Home</Menu.Item>
        <Menu.Item as='a' onClick={clickAction}>Sign Out</Menu.Item>
      </Menu>
    )
}

export default withRouter(Navbar);
