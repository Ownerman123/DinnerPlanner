import { Box, Text } from "@chakra-ui/react";
import { useAuth } from "../auth/useAuth";

const Home = () => {

    const { user } = useAuth();
    console.log(user);

    const homeText = user ? `Welcome home ${user.username}!` : "";



    return (
        <Box bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'} color={'white'} flexGrow={1}>

            <Text p={2}>{homeText}</Text>
            <Text p={2}>Welcome to Super Dinner planner. Sign up and get started!
                Planning meals has never been easier.
                Just input your favorite recipes or find other users recipes to add to your book.
                Then plan at the click of a button all the meals you need for the week.
                It doesnt get much simpler.
                Dinner planner is a free service ran on free servers.
                As such some load times can be quite slow while the servers spin up.
                Sorry for any inconvinence this may cause.</Text>

        </Box>
    )
}
export default Home;