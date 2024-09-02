import { FormControl, FormHelperText, FormErrorMessage, FormLabel, Input, Box, Button } from "@chakra-ui/react"
import { useState } from "react"

const Registration = () => {

    const [email, setEmail] = useState('');
    const [first, setFirst] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [last, setLast] = useState('');


    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleUserNameChange = (e) => setUserName(e.target.value);
    const handleFirstNameChange = (e) => setFirst(e.target.value);
    const handleLastNameChange = (e) => setLast(e.target.value);

    const handleSignup = async (e) => {
        const formInfo = {username: username, email: email, firstName: first, lastName: last, password:password}
        
        
        const newuser = await fetch('http://localhost:3001/api/user' , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formInfo),
        })
        if(newuser.status === 200){
            try{
                const token = await fetch('http://localhost:4001/login', {
                    method:'POST', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: username, password:password})
                });
                const tokensjson = await token.json();
                localStorage.setItem("authToken", JSON.stringify(tokensjson.accessToken));
                localStorage.setItem('refreshToken', JSON.stringify(tokensjson.refreshToken));
            }catch (err) {
                console.log(err);
            }
        }
    }


    const isEmpty = (input) => input === '';


    return (
        <>
            <Box width={500}>

                <FormControl isInvalid={isEmpty(first)}>
                    <FormLabel>First name</FormLabel>
                    <Input type='text' value={first} onChange={handleFirstNameChange} />
                    {!isEmpty(first) ? (
                        <FormHelperText>
                            Enter your first name.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>first name is required</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={isEmpty(last)}>
                    <FormLabel>Last name</FormLabel>
                    <Input type='text' value={last} onChange={handleLastNameChange} />
                    {!isEmpty(last) ? (
                        <FormHelperText>
                            Enter your last name.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>last name is required</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={isEmpty(username)}>
                    <FormLabel>Username</FormLabel>
                    <Input type='text' value={username} onChange={handleUserNameChange} />
                    {!isEmpty(username) ? (
                        <FormHelperText>
                            Enter the Username you'd like to signup with (This will be viewable by other users).
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>Username is required.</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={isEmpty(password)}>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' value={password} onChange={handlePasswordChange} />
                    {!isEmpty(password) ? (
                        <FormHelperText>
                            Enter the password you'd like to signup with (must be atleast 8 charaters in length).
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>Password is required.</FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={isEmpty(email)}>
                    <FormLabel>Email</FormLabel>
                    <Input type='email' value={email} onChange={handleEmailChange} />
                    {!isEmpty(email) ? (
                        <FormHelperText>
                            Enter the email you'd like to signup with.
                        </FormHelperText>
                    ) : (
                        <FormErrorMessage>Email is required.</FormErrorMessage>
                    )}
                </FormControl>

                <Button onClick={handleSignup}>Submit</Button>

            </Box>
        </>
    );

}
export default Registration;