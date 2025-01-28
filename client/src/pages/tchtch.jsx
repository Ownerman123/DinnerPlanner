import { Box, Flex , Text} from "@chakra-ui/react";
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { AuthProvider } from '../auth/useAuth'

const TchTch = () => {
    return(
        
        
        <Box id="" bg={'darkgrey'} color="white" height={"100%"}>
        <Flex height='100%' justifyContent={'center'}  >
        <Text alignSelf={'center'}>Hey man! That recipe isnt yours. Not cool...</Text>
        </Flex>
        </Box>
        
        
    )
}

export default TchTch;