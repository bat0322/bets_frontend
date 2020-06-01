import React, {useEffect, useState} from 'react'
import { Table } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.js';

const ProfileScreen = (props) => {
  const [user, setUser] = useState({});
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  if (!username || !password) props.history.push('/login');

  if (isAdmin) props.history.push('/');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/user/${username}/${password}`)
      .then(({ data }) => {
        console.log(JSON.stringify(data));
        setUser(data.response[0]);
      })
  }, [password, username])

  return (
    <div>
      <Navbar/>
      <div style={{'height':'40px', 'width':'100vw'}}/>
      <Table celled padded striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Field</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(user).map(([key, value]) => (
            <Table.Row key={key}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{value}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default withRouter(ProfileScreen);
