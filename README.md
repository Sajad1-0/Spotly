# **Spotly**

**Spotly** is a Node.js-based application for booking conference room and workspaces.
It provides a RESTful API with authentication, room management, and booking functionality.



## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Sajad1-0/Spotly.git
cd spotly
npm install
````
## Environment Variables
Create a **.env** file in the rool directory and configure the required variables. 

## Run the App
Start in development mode: 
```bash
npm run dev
````
Or in production mode:
```bash
npm run start
````
The server will start on https://localthost:0216
You can setup your own port in the .env file

## API Documentation
### Example Routes
- POST/login - Log in and recieve a token
- GET/rooms - Fetch all rooms
- GET/rooms/:id - Fetch a specific room
- POST/bookings - Create a new room booking
- DELETE/bookings/:id - Cancel a booking

## Technologies Used
- **Node.js** + **Express** - Backend framework
- **TypeScript** - Strongly typed JavaScript
- **JWT** - JSON Web Token for authentication
- **Winston** + **winston-daily-rotate-file** - Logging
- **dotenv** - Environment variable handling
- **bcrypt** - Password hashing

## Project Structure
spotly/
├── src/                  # Source code  
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE

## Contributing
Contributions are welcome!

1. Fork the repository

2. Create your feature branch: git checkout -b feature/awesome-feature

3. Commit your changes: git commit -m 'Add new feature'

4. Push to the branch: git push origin feature/awesome-feature

5. Open a pull request

For larger features or bugs, please open an issue first to discuss.


## License
This project is licensed under the ISC License. See the LICENSE file for details.

## Contact
If you encounter any issues or have suggestions, feel free to open an issue:
Email: Sajjadqaderi00@gmail.com 
**OR**
https://github.com/Sajad1-0/spotly/issues
