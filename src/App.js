import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';
// import { createServerConnection } from './socket-api'
const io = require('socket.io-client');
const socket = io('http://localhost:3005');

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function App() {
  const classes = useStyles();
  // const [socket, setSocket] = useStyles({})

  useEffect(async () => {
    console.log('useEffect App')

    socket.emit('room', { room: 'test-room' });

    // console.log("TCL: App -> socket", socket)
    // if (!socket || socket.disconnect) {
    //   let tempSocket = await createServerConnection()
    //   setSocket(tempSocket)
    // }
    // console.log("TCL: App -> socket", socket)

    // if (socket && socket.connected) {
    //   socket.emit('userIdReceived', this.state.userId)

    //   socket.on('userAuthenticated', (massage) => {
    //     socket.emit('initTrackersLocations', this.state.userId)
    //   })

    //   socket.on('initTrackersLocations', (userTrackersData) => {
    //   })

    //   socket.on('location', (updatedLocation) => {
    //   })
    // }
  }, [])

  return (
    <div className="App">
      <div className="ContainerGame">
        <Fab variant="extended">
          send request 1
      </Fab>
        <Fab variant="extended">
          send request 2
      </Fab>
        <Fab variant="extended">
          send request 3
      </Fab>
      </div>
    </div>
  );
}

export default App;
