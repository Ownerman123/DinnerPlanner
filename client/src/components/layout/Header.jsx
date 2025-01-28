import {
  Box,
  Heading,
  Flex,
  Link,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Show,
  IconButton,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { HamburgerIcon } from "@chakra-ui/icons";

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
  const loggedLinks = isLoggedIn ? (
    <>
      <Link p={3} as={RouterLink} to={'/newrecipe'}>Add New Recipe</Link>
      <Link p={3} as={RouterLink} to={'/userrecipes'}>My Recipes</Link>
      <Link p={3} as={RouterLink} to={'/userbook'}>My Book</Link>
      <Link p={3} as={RouterLink} to={'/plan'}>Plan</Link>
    </>

  ) : <></>;


  return (
    <header >
      <Box bg="trimbluegrey" color={'offwhite'} >
        <Flex
          w="100%"
          h="100%"
          p={0}
          borderBottom="1px"
          alignContent={"center"}
        >
          <Heading p={2}><Link as={RouterLink} to={'/'}>Dinner Planner!</Link></Heading>
          <Spacer></Spacer>
          <nav>
            <Show above="lg">
              <Flex alignContent="center" height="100%" wrap="wrap" pr={1}>
                <Link p={3} as={RouterLink} to={"/recipes"}>Discover</Link>
                {loggedLinks}
                <Link p={3} as={RouterLink} onClick={handleAuthAction}>{logButton}</Link>
              </Flex>
            </Show>
            <Show below="lg">
              <Flex alignContent="center" height="100%" wrap="wrap" pr={4}>
                <Menu p={4} alignContent="center" color={'black'}>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon color="white" />}
                    variant={'iconButt'}
                    alignContent="center"
                    alignSelf="center"
                  />
                  <MenuList color={"black"}>
                    <MenuItem as={RouterLink} to="/">
                      Home
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/newrecipe">
                      Add New Recipe
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/userrecipes">
                      My Recipes
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/userbook">
                      My Book
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/plan">
                      Plan
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/recipes">
                      Discover
                    </MenuItem>

                  </MenuList>
                </Menu>
                <Link p={3} as={RouterLink} onClick={handleAuthAction}>{logButton}</Link>
              </Flex>
            </Show>
          </nav>
        </Flex>
      </Box>
    </header>
  )
}

export default Header;