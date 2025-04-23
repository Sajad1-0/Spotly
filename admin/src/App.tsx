import { Outlet, Link } from "react-router"


function App() {


  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to= "/register">Register</Link>
        <Link to= "/login">Login</Link>
      </nav>


      <Outlet/>
    </div>
  )
}

export default App
