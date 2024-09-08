import { Button, Heading } from "@chakra-ui/react"
import { Link } from "react-router-dom";
import Registration from "../../pages/Registration";
import { useAuth } from "../../auth/useAuth";

const Header = () => {

    const {isLoggedIn, logout} = useAuth();
    const handleAuthAction = () => {
        if (isLoggedIn) {
          logout();
          // The logout function in AuthService handles redirection,
          // but you might want to use navigate here instead
          // navigate('/');
        } else {
          window.location.assign('/login');
        }
      };

    const logButton = isLoggedIn ? "Logout" : "Login/SignUp";

    return( 
        <header>
            <Heading>Dinner Planner!</Heading>
            <nav> <Link onClick={handleAuthAction}>{logButton}</Link></nav>
        </header>
    )
}

export default Header;