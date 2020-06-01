import React, { useState } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const Login = (props) => {
  const [state, setState] = useState({username: '', password: ''});
  const {username, password} = state;
  const storageUsername = sessionStorage.getItem('username');
  const storagePassword = sessionStorage.getItem('password');

  if (storagePassword && storageUsername) {
    props.history.push('/');
  }

  const loginAdmin = () => {
    axios.get(`http://localhost:3000/api/AdminSignIn/${username}/${password}`)
      .then(({ data }) => {
        console.log(data);
        if (data.status !== 200) alert(data.response);
        else {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('isAdmin', 'true');
          props.history.push('/');
        }
      })
  }

  const loginUser = () => {
    axios.get(`http://localhost:3000/api/UserSignIn/${username}/${password}`)
      .then(({ data }) => {
        console.log(data);
        if (data.status !== 200) alert(data.response);
        else {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('isAdmin', 'false');
          props.history.push('/');
        }
      });
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='green' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={(e) => setState({...state, username: e.target.value})}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setState({...state, password: e.target.value})}
            />
            <div style={{'display':'flex','flexDirection':'row'}}>
              <Button color='green' fluid size='large' onClick={loginUser}>
                User Login
              </Button>
              <Button color='blue' fluid size='large' onClick={loginAdmin}>
                Admin Login
              </Button>
            </div>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default withRouter(Login);
