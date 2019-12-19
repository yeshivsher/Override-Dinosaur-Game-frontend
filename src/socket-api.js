import openSocket from 'socket.io-client';
import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import { async } from 'q';

var socket = null;

// socket = openSocket('localhost:3005')


const checkServerConnection = () => {
    try {
        socket = openSocket('localhost:3005');
        return true;

    } catch (error) {
        console.log("TCL: checkServerConnection -> error", error)
        return false;
    }
}

const createServerConnection = async () => {
    try {
        socket = await openSocket('localhost:3005')

        console.log('Create connection to the server..')

        return socket
    } catch (error) {
        console.log("CreateServerConnection -> error", error)
    }
}

const subscribeToRedisServer = (callback) => {
    socket = openSocket('localhost:3005');

    console.log("TCL: subscribeToRedisServer -> socket", socket)

    console.log('client connected')

    // socket.on('location', test => callback(null, test));

    socket.on('location', function (test) {
        console.log("TCL: subscribeToRedisServer -> test1 ", test)
        // socket.emit('location', 'client here 2');
    });

    socket.emit('location', 'client here');

}

export {
    subscribeToRedisServer,
    checkServerConnection,
    createServerConnection,
    socket
};