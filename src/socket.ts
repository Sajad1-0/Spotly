import {Server} from 'socket.io';
import {createServer} from 'http';
import {Express} from 'express'



export const socketSetup = (app: Express) => {
    const httpServer = createServer(app)
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:0216',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        } 
    });

    io.on('connection', (socket) => {
        console.log('A User connected: ', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id)
        })
    } )

    return {httpServer, io}
}

