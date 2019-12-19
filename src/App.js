import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Typography } from '@material-ui/core';
import Game from './Game/Game';

// import { createServerConnection } from './socket-api'
const io = require('socket.io-client');
const socket = io('http://localhost:3005')

const useStyles = makeStyles(theme => ({
  app: {
    textAlign: 'center',
    backgroundColor: '#282c34',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  header: {
    height: '10%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'center',
    color: '#afb1b3'
  },
  title:{
    marginTop:10,
  },
  upBody: {
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  downBody: {
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  containerGame: {
    width: '75%',
    height: '80%',
    backgroundColor: '#61dafb',
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  controlPanel: {
    width: '15%',
    height: '80%',
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    background: '#608bb0',
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column'
  },
  button: {
    alignSelf: 'center',
    width: '90%',
    background: '#ef8243'
  },

  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  middle: {
    height: 5,
    width: "100%"
  }
}));

function App() {
  const classes = useStyles();
  // const [socket, setSocket] = useStyles({})

  useEffect(function () {
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
    <div className={classes.app}>
      <div className={classes.header}>
        <Typography variant="h3" weight="medium" className={classes.title}>
          Multiplayer Dinosaur Game!
        </Typography>

      </div>
      <div className={classes.upBody}>
        <div className={classes.containerGame}>
          <Game />
        </div>
        <div className={classes.controlPanel}>
          <Fab variant="extended" className={classes.button}>
            send request 1
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 2
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 3
      </Fab>
        </div>
      </div>
      <div className={classes.middle}></div>
      <div className={classes.downBody}>
        <div className={classes.containerGame}>

        </div>
        <div className={classes.controlPanel}>
          <Fab variant="extended" className={classes.button}>
            send request 1
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 2
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 3
      </Fab>
        </div>
      </div>
    </div>
  );
}

export default App;
