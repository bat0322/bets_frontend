import React, { useEffect, useState } from 'react'
import { Table, Button, Icon, Modal, Header, Input } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import Navbar from '../components/Navbar.js';

const UserBetsScreen = (props) => {
  const [state, setState] = useState({rows: [], reloads: 0, modalOpen: false, selectedBet: -1, betValue: 1})
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');

  const {rows, reloads, modalOpen, selectedBet, betValue} = state;

  if (!username || !password) props.history.push('/login');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/mybets/${username}/${password}`)
      .then(({ data }) => {
        console.log(JSON.stringify(data));
        setState((s) => ({...s, rows: data.response}));
      })
  }, [username, password, reloads]);

  return (
    <div>
      <Navbar />
      <div style={{'height':'40px', 'width':'100vw'}}/>
      <Table celled padded striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Time Placed</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.BetID}>
              <Table.Cell>{row.BetName}</Table.Cell>
              <Table.Cell>{row.BetDescription}</Table.Cell>
              <Table.Cell>{row.Amount}</Table.Cell>
              <Table.Cell>{row.TimePlaced}</Table.Cell>
              <Table.Cell>
                <Button
                  icon
                  onClick={() => {setState({...state, selectedBet: row.BetID, betValue: row.Amount, modalOpen: true})}}
                >
                  <Icon name='edit'/></Button>
                <Button
                  icon
                  onClick={() => {
                    axios.delete(`http://localhost:3000/api/deleteBet/${row.BetID}/${username}/${password}`)
                      .then(({ data }) => {
                        console.log(data);
                        if (data.status === 200) {
                          alert('Bet deleted');
                          setState({...state, reloads: reloads + 1});
                        }
                        else alert('Bet failed to delete');
                      })
                  }}
                >
                  <Icon name='trash'/>
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal
        open={modalOpen}
        onClose={() => setState((s) => ({...s, modalOpen: false}))}
        size='small'
      >
        <Modal.Header>Enter bet amount</Modal.Header>
        <Modal.Content>
          <Header size='small'>Amount:</Header>
          <Input
            type='number'
            value={betValue}
            onChange={(e) => {
              setState({...state, betValue: e.target.value});
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              const bet = selectedBet;
              const amt = betValue;
              axios.put(
                `http://localhost:3000/api/changeBet/${username}/${password}`,
                {BetID: bet, amount: amt}
              )
                .then(({ data }) => {
                  console.log(data);
                  if (data.status === 201) {
                    alert('Bet changed');
                    setState({
                      ...state,
                      reloads: reloads+1,
                      selectedBet: '',
                      modalOpen: false,
                      betValue: 1
                    });
                  }
                  else alert('Change failed');

                })
            }}
          >Change bet</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default withRouter(UserBetsScreen);
