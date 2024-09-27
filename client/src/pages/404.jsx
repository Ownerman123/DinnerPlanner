import { Box, Flex , Text} from "@chakra-ui/react";
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { AuthProvider } from '../auth/useAuth'

const _404 = ({pageErr}) => {
    return(
        <AuthProvider>
        <Header/>
        <Box id="filler" bg={'darkgrey'} color="white">
        <Flex height='100%' justifyContent={'center'}  >
        <Text alignSelf={'center'}>uh oh! {pageErr} </Text>
        
        </Flex>
        </Box>
        
        <Footer/>
        </AuthProvider>
    )
}

export default _404;