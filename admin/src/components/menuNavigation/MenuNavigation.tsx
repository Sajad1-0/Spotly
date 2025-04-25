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
        <div>
            <Link to='/'>
                <img src={Logo} alt="Application Logo" 
                className="w-24 lg:w-40 m-6" />
            </Link>
        </div>

        
        <div className="w-full flex md:justify-between lg:justify-around ">

        {/* Left side of Menu Navigation */}
            <div className="py-2 m-4 lg:m-6">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem className="flex gap-10">
                            <NavigationMenuTrigger className="text-md px-4 py-2 transition-colors 
                                data-[state=open]:bg-[#0284c7]
                                hover:bg-[#0284c7]
                                data-[state=open]:hover:bg-[#0284c7]
                                data-[state=open]:focus:bg-[#0284c7] 
                                ">
                                Rooms
                            </NavigationMenuTrigger>
                            <NavigationMenuContent >
                                <ul className="flex flex-col gap-3 p-2 w-[150px]">
                                    <li>
                                        <NavigationMenuLink asChild
                                        className="hover:bg-[#0284c7] transition-colors">
                                            <Link to="/rooms:workspace">Workspace Rooms</Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink
                                        className="hover:bg-[#0284c7] transition-colors">
                                            <Link to="/rooms:conference">Conference Rooms</Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                            <Link to="/bookings">
                                <NavigationMenuLink className={`${navigationMenuTriggerStyle()}
                                text-md px-4 py-2 hover:bg-[#0284c7]`}>
                                    Bookings
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right side of menu */}
            <div className="py-2 m-4 flex gap-8 lg:py-0 ">
                <NavigationMenu>
                    <NavigationMenuList>
                        <Link to="/login">
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} 
                            text-md px-4 py-2 hover:bg-[#0284c7]`}>
                                Login
                            </NavigationMenuLink>
                        </Link>
                        <Link to="/register">
                            <NavigationMenuLink className={`${navigationMenuTriggerStyle()} 
                            text-md px-4 py-2 hover:bg-[#0284c7]`}>
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