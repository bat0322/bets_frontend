import React, { useEffect, useState } from 'react';
import { Table, Button, Icon, Modal, Header, Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.js';

const Homescreen = (props) => {
  const defaultEvent = {
    EventName: '',
    EventDescription: '',
    StartTime: '',
    CategoryID: 0,
    Status: ''
  }
  const [state, setState] = useState({
    rows: [],
    reloads: 0,
    modalOpen: false,
    createModalOpen: false,
    editedEvent: defaultEvent,
    newEvent: defaultEvent
  });
  const username = sessionStorage.getItem('username');
  const password = sessionStorage.getItem('password');
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  const { rows, reloads, modalOpen, createModalOpen, editedEvent, newEvent } = state;

  if (!username || !password) props.history.push('/login');

  const AdminHeaderCell = () => {
    if (isAdmin) return (<Table.HeaderCell>Actions</Table.HeaderCell>);
    else return null;
  }

  const AdminCell= ({ eventName, event }) => {
    if (isAdmin) return (
      <Table.Cell>
        <Button
          icon
          className='except'
          onClick={() => {
            setState({
              ...state,
              modalOpen: true,
              editedEvent: {
                ...event,
                newEventName: eventName
              }
            })
          }}
        >
          <Icon className='except' name='edit'/></Button>
        <Button
          icon
          className='except'
          onClick={() => {
            axios.delete(`http://localhost:3000/api/events/${eventName}/${username}/${password}`)
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
    axios.get(`http://localhost:3000/api/Events/${username}/${password}`)
      .then(({ data }) => {
        console.log(JSON.stringify(data));
        if (data.status === 200)
          setState((s) => ({...s, rows:data.response}));
      })
  }, [username, password, reloads]);

  return (
    <div>
      <Navbar />
      <div style={{'height':'40px', 'width':'100vw'}}/>
      <Table celled padded striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Starts</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <AdminHeaderCell/>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row
              key={row.EventID}
              onClick={(e) => {
                if (!e.target.className.includes('except'))
                  props.history.push({
                    pathname: `/event/${row.EventID}`,
                    state: {eventName: row.EventName}
                  });
              }}
              style={{cursor:'pointer'}}
            >
              <Table.Cell>{row.EventName}</Table.Cell>
              <Table.Cell>{row.EventDescription}</Table.Cell>
              <Table.Cell>{row.StartTime}</Table.Cell>
              <Table.Cell>{row.Status}</Table.Cell>
              <AdminCell eventName={row.EventName} event={row} />
            </Table.Row>
            )
          )}
        </Table.Body>
      </Table>
      <Modal
        open={modalOpen}
        onClose={() => setState((s) => ({...s, modalOpen: false}))}
        size='small'
      >
        <Modal.Header>Enter changed values</Modal.Header>
        <Modal.Content>
          <Header size='small'>Name:</Header>
          <Input
            value={editedEvent.newEventName}
            onChange={(e) => {
              setState({...state, editedEvent: {...editedEvent, newEventName: e.target.value}});
            }}
          />
          <Header size='small'>Description:</Header>
          <Input
            value={editedEvent.EventDescription}
            onChange={(e) => {
              setState({...state, editedEvent: {...editedEvent, EventDescription: e.target.value}});
            }}
          />
          <Header size='small'>StartTime:</Header>
          <Input
            value={editedEvent.StartTime}
            onChange={(e) => {
              setState({...state, editedEvent: {...editedEvent, StartTime: e.target.value}});
            }}
          />
          <Header size='small'>CategoryID:</Header>
          <Input
            value={editedEvent.CategoryID}
            onChange={(e) => {
              setState({...state, editedEvent: {...editedEvent, CategoryID: e.target.value}});
            }}
          />
          <Header size='small'>Status:</Header>
          <Input
            value={editedEvent.Status}
            onChange={(e) => {
              setState({...state, editedEvent: {...editedEvent, Status: e.target.value}});
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              axios.put(
                `http://localhost:3000/api/adminChangeEvent/${username}/${password}`,
                editedEvent
              )
                .then(({ data }) => {
                  console.log(data);
                  if (data.status === 201) {
                    alert('Bet changed');
                    setState({
                      ...state,
                      reloads: reloads+1,
                      editedEvent: defaultEvent,
                      modalOpen: false,
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
          <Modal.Header>Enter values</Modal.Header>
          <Modal.Content>
            <Header size='small'>Name:</Header>
            <Input
              value={newEvent.EventName}
              onChange={(e) => {
                setState({...state, newEvent: {...newEvent, EventName: e.target.value}});
              }}
            />
            <Header size='small'>Description:</Header>
            <Input
              value={newEvent.EventDescription}
              onChange={(e) => {
                setState({...state, newEvent: {...newEvent, EventDescription: e.target.value}});
              }}
            />
            <Header size='small'>StartTime:</Header>
            <Input
              value={newEvent.StartTime}
              onChange={(e) => {
                setState({...state, newEvent: {...newEvent, StartTime: e.target.value}});
              }}
            />
            <Header size='small'>CategoryID:</Header>
            <Input
              value={newEvent.CategoryID}
              onChange={(e) => {
                setState({...state, newEvent: {...newEvent, CategoryID: e.target.value}});
              }}
            />
            <Header size='small'>Status:</Header>
            <Input
              value={newEvent.Status}
              onChange={(e) => {
                setState({...state, newEvent: {...newEvent, Status: e.target.value}});
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => {
                axios.post(
                  `http://localhost:3000/api/Events/${username}/${password}`,
                  newEvent
                )
                  .then(({ data }) => {
                    console.log(data);
                    if (data.status === 200) {
                      alert('Event added');
                      setState({
                        ...state,
                        reloads: reloads+1,
                        newEvent: defaultEvent,
                        createModalOpen: false,
                      });
                    }
                    else alert('Change failed');

                  })
              }}
            >Add event</Button>
          </Modal.Actions>
        </Modal>
      ) : null }
    </div>
  )
}

export default withRouter(Homescreen);
