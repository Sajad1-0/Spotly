import { Link } from "react-router"
import Logo from '../../assets/Logo.png'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu"
const MenuNavigation = () => {
  return (
    <div className="w-full flex gap-20">
        {/* Logo for application */}
        <div className="z-10">
            <Link to='/'>
                <img src={Logo} alt="Application Logo" 
                className="w-24 lg:w-40 m-6" />
            </Link>
        </div>

        
        <div className="w-full flex md:justify-between lg:justify-around z-10">

        {/* Left side of Menu Navigation */}
            <div className="py-2 m-4 lg:m-6">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem className="flex gap-10">
                            <Link to="/rooms">
                            <NavigationMenuTrigger className="text-md lg:text-xl
                                bg-transparent transition-colors 
                                data-[state=open]:bg-transparent
                                hover:bg-transparent
                                focus:bg-transparent
                                data-[state=open]:hover:bg-transparent
                                data-[state=open]:focus:bg-transparent
                                ">
                                Rooms
                            </NavigationMenuTrigger>
                            </Link>
                           
                            <NavigationMenuContent>
                                <ul className="flex flex-col gap-3 p-2 w-[150px]">
                                    <li>
                                        <NavigationMenuLink asChild
                                        className="hover:bg-[#a16207] transition-colors lg:text-md">
                                            <Link to="/rooms:workspace">Workspace Rooms</Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink
                                        className="hover:bg-[#a16207] transition-colors">
                                            <Link to="/rooms:conference">Conference Rooms</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                            <Link to="/bookings">
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()}
                                text-md lg:text-xl px-4 py-2 focus:bg-[#a16207] 
                                hover:bg-transparent bg-transparent`}>
                                    Bookings
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right side of menu */}
            <div className="py-2 m-4 flex">
                <NavigationMenu>
                    <NavigationMenuList>
                        <Link to="/login">
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} 
                            text-md lg:text-xl px-4 py-2 
                            hover:bg-transparent bg-transparent`}>
                                Login
                            </NavigationMenuLink>
                        </Link>
                        <Link to="/register">
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} 
                            text-md lg:text-xl px-4 py-2 hover:bg-[#a16207]`}>
                                Register
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            
        </div>
    </div>
  )
}

export default MenuNavigation