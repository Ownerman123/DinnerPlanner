
import { Flex, Box, Text, } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box
            as="footer"
            bg="black"
            color="white"
            borderTop="1px solid"
            borderColor="gray.600"
            py={4}
        >
            <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                mb={4}
            >
                {/* other links and shtuff */}
            </Flex>
            <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                mt={4}
            >

                <Text fontSize="sm" mt={4}>
                    © 2024 Ownerman123. All rights reserved.
                </Text>
            </Flex>
        </Box>
    );
};

export default Footer;