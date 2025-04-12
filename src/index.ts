import dotenv from 'dotenv';
import express, {Express} from "express";
import userRouter from './routes/user-routes'
import roomRouter from './routes/rooms-router'
import bookingRouter from './routes/booking-routes'
import { drizzle } from 'drizzle-orm/node-postgres';
import { authenticateToken } from './middlewares/auth-utils-service';
import { socketSetup } from './socket';
import cors from 'cors'
 
dotenv.config();


const app: Express = express();
const {httpServer, io} = socketSetup(app)
const port = process.env.SERVER_PORT;
app.set('io', io) // Spara io-instansen så router kan komma åt den.

// connect to databse
export const db = drizzle(process.env.DATABASE_URL!);

// middleware 
app.use(cors())
app.use(express.static('client'))
app.use(express.json());
app.use(authenticateToken)

app.get('/', (req, res) => {
    res.send(`
      <h1>Välkommen till bokningssystemet</h1>
      <a href="/client">Öppna Socket.io klienten</a>
    `);
  });

app.get('/client', (req, res) => {
     // path.join() skapar en korrekt sökväg för aktuellt operativsystem
    res.sendFile('client.html', {root: 'client'});
  });
app.use('/users', userRouter)
app.use('/rooms', roomRouter)
app.use('/bookings', bookingRouter)


httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})