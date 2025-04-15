"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const rooms_router_1 = __importDefault(require("./routes/rooms-router"));
const booking_routes_1 = __importDefault(require("./routes/booking-routes"));
const node_postgres_1 = require("drizzle-orm/node-postgres");
const auth_utils_service_1 = require("./middlewares/auth-utils-service");
const socket_1 = require("./socket");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const { httpServer, io } = (0, socket_1.socketSetup)(app);
const port = process.env.SERVER_PORT;
app.set('io', io); // Spara io-instansen så router kan komma åt den.
// connect to databse
exports.db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
// middleware 
app.use((0, cors_1.default)());
app.use(express_1.default.static('client'));
app.use(express_1.default.json());
app.use(auth_utils_service_1.authenticateToken);
app.get('/', (req, res) => {
    res.send(`
      <h1>Välkommen till bokningssystemet</h1>
      <a href="/client">Öppna Socket.io klienten</a>
    `);
});
app.get('/client', (req, res) => {
    // path.join() skapar en korrekt sökväg för aktuellt operativsystem
    res.sendFile('client.html', { root: 'client' });
});
app.use('/users', user_routes_1.default);
app.use('/rooms', rooms_router_1.default);
app.use('/bookings', booking_routes_1.default);
httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
