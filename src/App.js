import React, { useEffect, useState } from 'react';
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
// const socket = io('http://localhost:3005')

const useStyles = makeStyles(theme => ({
  app: {
    textAlign: 'center',
    backgroundColor: '#282c34',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'auto'
  },
  header: {
    height: '10%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: 'center',
    color: '#afb1b3'
  },
  title: {
    marginTop: 10,
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
    border: 'solid',
    borderColor: 'darkorange'
  },
  containerGameRival: {
    width: '75%',
    height: '80%',
    backgroundColor: '#61dafb',
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',

  },
  controlPanel: {
    color: '#afb1b3',
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
  controlPanelRival: {
    color: '#afb1b3',
    width: '15%',
    height: '80%',
    textAlign: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    background: '#608bb0',
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    border: 'solid',
    borderColor: 'darkorange'
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
  const [_socket, _setSocket] = useState()
  const [obstacles_p, setObstacles_p] = useState([])
  const [backgroundColorOverrided, setBackgroundColorOverrided] = useState(false)
  const [overridedObstacles, setOverridedObstacles] = useState([])

  const sendObstacles = (obstacles) => {
    if (_socket) {

      _socket.emit('obstacles', obstacles);
    }
  }

  const handleChangeBackgroundButton = () => {
    _socket.emit('change background to rival');
  }

  useEffect(function () {
    let socket = io("http://localhost:3005");
    if (!socket) {
      _setSocket(socket)
      console.log('useEffect App')

      socket.emit('room', { room: 'test-room' });
    }

    socket.on('start game', (player) => {
      console.log("TCL: App -> player", player)
      // socket.emit('initTrackersLocations', this.state.userId)

    })

    socket.on('change background to rival', () => {
      console.log("TCL: App -> change background to rival")
      setBackgroundColorOverrided(backgroundColorOverrided)
      // socket.emit('initTrackersLocations', this.state.userId)

    })

    socket.on('rival send obstacle', (obstacles) => {
      console.log("TCL: recived -> obstacles", obstacles)
      setObstacles_p(obstacles);
    })
  }, [])

  return (
    <div className={classes.app}>
      <div className={classes.header}>
        <Typography variant="h3" weight="medium" className={classes.title}>
          Multiplayer Dinosaur Game!
        </Typography>
      </div>
      <div className={classes.upBody}>
        <div className={classes.containerGame} style={{ background: backgroundColorOverrided ? '#608bb0' : '#608bb000' }}>
          <Game isMine={true} overridedObstacles={overridedObstacles} sendObstacles={sendObstacles} />
        </div>
        <div className={classes.controlPanel}>
          <Typography variant="h4" weight="medium" >
            You
          </Typography>
          {/* <Fab variant="extended" className={classes.button}>
            send request 1
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 2
      </Fab>
          <Fab variant="extended" className={classes.button}>
            send request 3
      </Fab> */}
        </div>
      </div>
      <div className={classes.middle}></div>
      <div className={classes.downBody}>
        <div className={classes.containerGameRival}>
          <Game isMine={false} obstacles_p={obstacles_p} overridedObstacles={overridedObstacles} sendObstacles={sendObstacles} />
        </div>
        <div className={classes.controlPanelRival}>
          <Typography variant="h5" weight="medium" >
            Controle Rival!
          </Typography>
          <Fab variant="extended" className={classes.button}>
            Send Obstacle
      </Fab>
          <Fab variant="extended" className={classes.button} onClick={() => {
            handleChangeBackgroundButton()
          }}>
            Change Background
      </Fab>
          <Fab variant="extended" className={classes.button}>
            Send A Crow
      </Fab>
        </div>
      </div>
    </div>
  );
}

export default App;
