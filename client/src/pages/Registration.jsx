/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
import { FormControl, FormHelperText, FormErrorMessage, FormLabel, Input, Box, Container, Button, Text, TabPanel, Tab, Tabs, TabPanels, TabList, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { useAuth } from "../auth/useAuth"

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;
const AuthAPI = import.meta.env.VITE_AUTH_URL || `http://localhost:4001`;

const Registration = () => {

    function isEmail(string) {
        var matcher = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (string.length > 320) return false;
        return matcher.test(string);
    }

    const { login: authLogin, isLoggedIn, logout } = useAuth();

    const [email, setEmail] = useState('');
    const [first, setFirst] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [username, setUserName] = useState('');
    const [last, setLast] = useState('');
    const [error, setError] = useState('');

    const [fetching, setfetching] = useState(false);


    const handleEmailChange = (e) => setEmail(e.target.value.toLowerCase());
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleVerifyPasswordChange = (e) => setVerifyPassword(e.target.value);
    const handleUserNameChange = (e) => setUserName(e.target.value);
    const handleFirstNameChange = (e) => setFirst(e.target.value);
    const handleLastNameChange = (e) => setLast(e.target.value);


    const handleSignup = async () => {
        const formInfo = { username: username, email: email, firstName: first, lastName: last, password: password }
        if (!formInfo.username || !formInfo.email || !formInfo.firstName || !formInfo.lastName || !formInfo.password) {
            return setError("all fields must be filled");
        }
        if (password.length < 8) {
            return setError('password must be atleast 8 characters long');
        }
        setError('');

        setfetching(true);
        const data = await fetch(`${API}/api/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formInfo),
        });
        const newuser = await data.json();

        if (newuser._id) {
            try {
                console.log(newuser);
                const token = await fetch(`${AuthAPI}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password })
                });
                const tokensjson = await token.json();
                localStorage.setItem("authToken", JSON.stringify(tokensjson.accessToken));
                localStorage.setItem('refreshToken', JSON.stringify(tokensjson.refreshToken));
                authLogin(tokensjson.accessToken);
                setfetching(false);
                setError('')
            } catch (err) {
                setfetching(false);
                console.log(err);
            }
        } else {
           // console.log('in else statement', newuser);
            setError('User with that Username or email already exists');
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const formInfo = { email: email, password: password }
        if (!formInfo.email || !formInfo.password) {
            return setError("all fields must be filled");
        }


        try {

            setfetching(true);

            const token = await fetch(`${AuthAPI}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            });
            const tokensjson = await token.json();

            if ('accessToken' in tokensjson) {

                localStorage.setItem("authToken", JSON.stringify(tokensjson.accessToken));
                localStorage.setItem('refreshToken', JSON.stringify(tokensjson.refreshToken));

                authLogin(tokensjson.accessToken);
                setfetching(false);

            } else {
                setfetching(false);
                return setError('email or password incorrect');
            }
        } catch (err) {
            setfetching(false);
            console.log(err);
        }

    }

    const isEmpty = (input) => input === '';
    const validPassword = (pass) => pass.length >= 8;
    const validEmail = (em) => isEmail(em);

    const passwordsmatch = (p1, p2) => p1 === p2;

    if (isLoggedIn) {
        return (
            <>
                <p>You must log out before logging in to a seperate account</p>
                <button onClick={async () => { await logout(); }}>Logout</button>
            </>
        )
    }

    return (
        <>
            <Box bg='radial-gradient(circle at top left, #9fc0d1, #608da4)'   flexGrow={1}>
                <Container maxW="md" py={8} minH={'100%'} >

                    <Tabs bg="cardlightblue" border="2px" borderRadius="lg" borderColor="trimbluegrey" boxShadow='2xl'>
                        <TabList bg="offwhite" borderTopRadius='lg' borderBottom='0'>
                            <Tab>Login</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>

                            <TabPanel>

                                <Box width={"100%"}>
                                    <FormControl isInvalid={!validEmail(email)} >
                                        <FormLabel>Email</FormLabel>
                                        <Input type='email' value={email} placeholder="Email..." onChange={handleEmailChange} bg='white' />
                                        {isEmpty(email) ? (
                                            <FormHelperText>
                                                <></>
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Email is required.</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl >
                                        <FormLabel>Password</FormLabel>
                                        <Input type='password' value={password} placeholder="Password..." onChange={handlePasswordChange} bg='white' />

                                    </FormControl>

                                    <Text>{error}</Text>

                                    <Button disabled={fetching} mt={3} onClick={handleLogin} type="submit" colorScheme="trimbluegrey" variant= "colored">Login</Button>

                                </Box>
                            </TabPanel>
                            <TabPanel>

                                <Box width={"100%"} >

                                    <FormControl isInvalid={!first}>
                                        <FormLabel>First name</FormLabel>
                                        <Input type='text' value={first} placeholder="First name..." onChange={handleFirstNameChange} bg='white' />
                                        {isEmpty(first) ? (
                                            <FormHelperText>
                                                Enter your first name.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>first name is required</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl isInvalid={isEmpty(last)}>
                                        <FormLabel>Last name</FormLabel>
                                        <Input type='text' value={last} placeholder="Last name..." onChange={handleLastNameChange} bg='white' />
                                        {isEmpty(last) ? (
                                            <FormHelperText>
                                                Enter your last name.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>last name is required</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl isInvalid={isEmpty(username)}>
                                        <FormLabel>Username</FormLabel>
                                        <Input type='text' value={username} placeholder="Username..." onChange={handleUserNameChange} bg='white' />
                                        {isEmpty(username) ? (
                                            <FormHelperText>
                                                Enter the Username you'd like to signup with (This will be viewable by other users dont use your email).
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Username is required.</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl isInvalid={!validPassword(password)}>
                                        <FormLabel>Password</FormLabel>
                                        <Input type='password' value={password} placeholder="Password..." onChange={handlePasswordChange} bg='white' />
                                        {isEmpty(password) ? (
                                            <FormHelperText>
                                                Enter the password you'd like to signup with (must be atleast 8 characters in length).
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Password must be atleast 8 characters in length.</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl isInvalid={!passwordsmatch(password, verifyPassword)}>
                                        <FormLabel>Verify Password</FormLabel>
                                        <Input type='password' value={verifyPassword} placeholder="Password again..." onChange={handleVerifyPasswordChange} bg='white' />
                                        {isEmpty(verifyPassword) && !passwordsmatch(password, verifyPassword) ? (
                                            <FormHelperText>
                                                Enter the password you'd like to signup with again (must match exactly).
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage> Both passwords must be typed exactly the same</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl isInvalid={!validEmail(email)}>
                                        <FormLabel>Email</FormLabel>
                                        <Input type='email' value={email} placeholder="Email..." onChange={handleEmailChange} bg='white' />
                                        {isEmpty(email) ? (
                                            <FormHelperText>
                                                Enter the email you'd like to signup with.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>Email is required.</FormErrorMessage>
                                        )}
                                    </FormControl>

                                    <Text>{error}</Text>

                                    <Button disabled={fetching} mt={3} onClick={handleSignup} type="submit" colorScheme="trimbluegrey" variant= "colored">Submit</Button>

                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Container>
            </Box>
        </>
    );

}
export default Registration;