import React, { useState, useEffect } from 'react'
import { Table, Modal, Header, Input, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.js';

const EventBetsScreen = (props) => {
  const defaultBet = {
    BetName: '',
    BetDescription: '',
    ExpiryTime: '',
    PayoutRatio: '',
    Status: '',
    TypeID: '',
  }
  const [state, setState] = useState({
      rows: [],
      reloads: 0,
      selectedBet: '',
      modalOpen: false,
      betValue: 0,
      editModalOpen: false,
      createModalOpen: false,
      editedBet: defaultBet,
      newBet: defaultBet
    });
  const {
    rows,
    reloads,
    selectedBet,
    modalOpen,
    betValue,
    editModalOpen,
    createModalOpen,
    editedBet,
    newBet
  } = state;
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const eventName = props.location.state.eventName;

  if (!username || !password) props.history.push('/login');

  const AdminHeaderCell = () => {
    if (isAdmin) return (<Table.HeaderCell>Actions</Table.HeaderCell>);
    else return null;
  }

  const AdminCell= ({ betName, bet }) => {
    if (isAdmin) return (
      <Table.Cell>
        <Button
          icon
          className='except'
          onClick={() => {
            setState({
              ...state,
              editModalOpen: true,
              editedBet: {
                ...bet,
                newBetName: betName
              }
            })
          }}
        >
          <Icon className='except' name='edit'/></Button>
        <Button
          icon
          className='except'
          onClick={() => {
            axios.delete(`http://localhost:3000/api/events/${betName}/${username}/${password}`)
              .then(({ data }) => {
                console.log(data);
                if (data.status === 201) {
                  alert('Event deleted');
                  setState({...state, reloads: reloads + 1});
                }
                else alert('Event failed to delete');
              })
          }}
        >
          <Icon className='except' name='trash'/>
        </Button>
      </Table.Cell>
    )
    else return null;
  }

  useEffect(() => {
    axios.get(`http://localhost:3000/api/betsByEvent/${eventName}/${username}/${password}`)
      .then(({ data }) => {
        console.log(JSON.stringify(data));
        setState((s) => ({...s, rows: data.response}));
      })
  }, [username, password, eventName, reloads]);

  return (
    <div>
      <Navbar/>
      <div style={{'height':'40px', 'width':'100vw'}}/>
      <Table celled padded striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Expires</Table.HeaderCell>
            <Table.HeaderCell>Payout</Table.HeaderCell>
            <AdminHeaderCell/>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row
              key={row.BetName}
              style={{cursor: 'pointer'}}
              onClick={(e) => {
                if (!e.target.className.includes('except') && !isAdmin)
                  setState((s) => (
                    { ...s,
                      selectedBet: row.BetName,
                      modalOpen: true
                    })
                  );
              }}
            >
              <Table.Cell>{row.BetName}</Table.Cell>
              <Table.Cell>{row.BetDescription}</Table.Cell>
              <Table.Cell>{row.ExpiryTime}</Table.Cell>
              <Table.Cell>{row.PayoutRatio}</Table.Cell>
              <AdminCell betName={row.BetName} bet={row}/>
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
              setState({...state, selectedBet: '', modalOpen: false, betValue: 0});
              axios.post(
                `http://localhost:3000/api/makeBet/${username}/${password}`,
                {BetName: bet, amount: amt}
              )
                .then(({ data }) => {
                  if (data.status === 201) alert('Bet placed!')
                  else alert('Bet failed');
                })
            }}
          >Place bet</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        open={editModalOpen}
        onClose={() => setState((s) => ({...s, editModalOpen: false}))}
        size='small'
      >
        <Modal.Header>Enter changed values</Modal.Header>
        <Modal.Content>
          <Header size='small'>Name:</Header>
          <Input
            value={editedBet.newBetName}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, newBetName: e.target.value}});
            }}
          />
          <Header size='small'>Description:</Header>
          <Input
            value={editedBet.BetDescription}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, BetDescription: e.target.value}});
            }}
          />
          <Header size='small'>Payout Ratio:</Header>
          <Input
            value={editedBet.PayoutRatio}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, PayoutRatio: e.target.value}});
            }}
          />
          <Header size='small'>StartTime:</Header>
          <Input
            value={editedBet.ExpiryTime}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, ExpiryTime: e.target.value}});
            }}
          />
          <Header size='small'>TypeID:</Header>
          <Input
            value={editedBet.TypeID}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, TypeID: e.target.value}});
            }}
          />
          <Header size='small'>Status:</Header>
          <Input
            value={editedBet.Status}
            onChange={(e) => {
              setState({...state, editedBet: {...editedBet, Status: e.target.value}});
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              axios.put(
                `http://localhost:3000/api/adminChangeBet/${username}/${password}`,
                editedBet
              )
                .then(({ data }) => {
                  console.log(data);
                  if (data.status === 201) {
                    alert('Bet changed');
                    setState({
                      ...state,
                      reloads: reloads+1,
                      editedBet: defaultBet,
                      editModalOpen: false,
                    });
                  }
                  else alert('Change failed');

                })
            }}
          >Submit changes</Button>
        </Modal.Actions>
      </Modal>
      { isAdmin ? (
      <Modal
        trigger={<Button onClick={() => setState({...state, createModalOpen: true})}>Add New</Button>}
        open={createModalOpen}
        onClose={() => setState((s) => ({...s, createModalOpen: false}))}
        size='small'
      >
        <Modal.Header>Enter changed values</Modal.Header>
        <Modal.Content>
          <Header size='small'>Name:</Header>
          <Input
            value={newBet.BetName}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, BetName: e.target.value}});
            }}
          />
          <Header size='small'>Description:</Header>
          <Input
            value={newBet.BetDescription}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, BetDescription: e.target.value}});
            }}
          />
          <Header size='small'>Payout Ratio:</Header>
          <Input
            value={newBet.PayoutRatio}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, PayoutRatio: e.target.value}});
            }}
          />
          <Header size='small'>StartTime:</Header>
          <Input
            value={newBet.ExpiryTime}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, ExpiryTime: e.target.value}});
            }}
          />
          <Header size='small'>TypeID:</Header>
          <Input
            value={newBet.TypeID}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, TypeID: e.target.value}});
            }}
          />
          <Header size='small'>Status:</Header>
          <Input
            value={newBet.Status}
            onChange={(e) => {
              setState({...state, newBet: {...newBet, Status: e.target.value}});
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              newBet['EventName'] = eventName;
              axios.post(
                `http://localhost:3000/api/Bets/${username}/${password}`,
                newBet
              )
                .then(({ data }) => {
                  console.log(data);
                  if (data.status === 200) {
                    alert('Bet created');
                    setState({
                      ...state,
                      reloads: reloads+1,
                      newBet: defaultBet,
                      createModalOpen: false,
                    });
                  }
                  else alert('Change failed');

                })
            }}
          >Create bet</Button>
        </Modal.Actions>
      </Modal>) : null}
    </div>
  );
}

export default withRouter(EventBetsScreen);
