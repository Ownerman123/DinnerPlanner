import { Heading } from "@chakra-ui/react"
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const Header = () => {

  const { isLoggedIn, logout } = useAuth();
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
  const newRecipeLink = isLoggedIn ? <Link to={'/newrecipe'}>Add new Recipe</Link> : <></>;
  const MyRecipesLink = isLoggedIn ? <Link to={'/userrecipes'}>My Recipes</Link> : <></>;
  const MyBookLink = isLoggedIn ? <Link to={'/userbook'}>My Book</Link> : <></>;

  return (
    <header>
      <Heading><Link to={'/'}>Dinner Planner!</Link></Heading>
      <nav>
        <Link onClick={handleAuthAction}>{logButton}</Link>
        <Link to={"/recipes"}>Discover</Link>
        {MyRecipesLink}
        {newRecipeLink}
        {MyBookLink}
      </nav>
    </header>
  )
}

export default Header;