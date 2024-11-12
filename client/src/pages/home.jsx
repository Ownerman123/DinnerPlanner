import { Box } from "@chakra-ui/react";
import { useAuth } from "../auth/useAuth";

const Home = () => {

const {user} = useAuth();
console.log(user);

const homeText = user ? `welcome home ${user.username}`: "Home!";



    return(
        <Box bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'} color={'white'} flexGrow={1}>

        <p>{homeText}</p>
        
        </Box>
    )
}
export default Home;