import { Outlet} from "react-router"
import MenuNavigation from "./components/menuNavigation/MenuNavigation"


function App() {


  return (
    <div>
      <MenuNavigation/>
      <Outlet/>
    </div>
  )
}

export default App
