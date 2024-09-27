import { Box } from "@chakra-ui/react";
import { useAuth } from "../auth/useAuth";

const Home = () => {

const {user} = useAuth();
console.log(user);

const homeText = user ? `welcome home ${user.username}`: "Home!";

    return(
        <Box bg={'darkgrey'} color={'white'}>

        <p>{homeText}</p>
        </Box>
    )
}
export default Home;