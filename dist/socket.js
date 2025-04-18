"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketSetup = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socketSetup = (app) => {
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:0216',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    });
    io.on('connection', (socket) => {
        console.log('A User connected: ', socket.id);
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });
    return { httpServer, io };
};
exports.socketSetup = socketSetup;
