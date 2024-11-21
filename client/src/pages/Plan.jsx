import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeStuff/RecipeCard"
import { useAuth } from "../auth/useAuth"
import { Box, Input, Button, IconButton, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { GiRollingDices } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import ShoppingList from "../components/recipeStuff/ShoppingList"

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const Plan = () => {

    const { user } = useAuth();
    const [formState, setFormState] = useState({
        snackCount: 0,
        mealCount: 1,
    });

    const [userData, setUserData] = useState(null);
    const [snacks, setSnacks] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            if (user) {

                const newUserData = await fetch(`${API}/api/user/${user._id}`, { method: 'get' }).then(response => {

                    if (response.ok) {

                        return response.json();
                    }
                    throw response;
                }).then(data => {
                    setUserData(data);
                    console.log(data);
                    setSnacks(howManySnacks(data.book));


                }).catch(err => {
                    console.log("Error fetching data", err);
                    setError(err);
                }).finally(() => setLoading(false));


                return newUserData;
            }
        }
        Getdata();
    }, [user]);

    async function getPlan() {
        await fetch(`${API}/api/user/plan`, {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formState, user: user._id })
        }).then(response => {

            if (response.ok) {

                return response.json();
            }
            throw response;
        }).then(data => {
            setUserData(data);



        }).catch(err => {
            console.log("Error fetching data", err);
            setError(err);
        });
    }
    async function getReroll(recipeId) {
        await fetch(`${API}/api/user/plan/roll`, {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: recipeId, user: user._id })
        }).then(response => {

            if (response.ok) {

                return response.json();
            }
            throw response;
        }).then(data => {
            setUserData(data);



        }).catch(err => {
            console.log("Error fetching data", err);
            setError(err);
        });
    }
    async function addToPlan(recipeId) {
        await fetch(`${API}/api/user/plan/add`, {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newRecipe: recipeId, user: user._id })
        }).then(response => {

            if (response.ok) {

                return response.json();
            }
            throw response;
        }).then(data => {
            setUserData(data);



        }).catch(err => {
            console.log("Error fetching data", err);
            setError(err);
        });
    }
    async function removeFromList(recipeId) {
        await fetch(`${API}/api/user/plan/remove`, {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ removeRecipe: recipeId, user: user._id })
        }).then(response => {

            if (response.ok) {

                return response.json();
            }
            throw response;
        }).then(data => {
            setUserData(data);



        }).catch(err => {
            console.log("Error fetching data", err);
            setError(err);
        });
    }

    const handleNumChange = (e) => {

        let { name, value } = e.target;
        if (name === "snackCount") {
            if (value > snacks) {
                value = snacks;
            }
        }
        if (name === "mealCount") {
            if (value > userData.book.length - snacks) {
                value = userData.book.length - snacks;
            }
        }

        setFormState({
            ...formState,
            [name]: value,
        });
    };
    function howManySnacks(book) {
        if (!Array.isArray(book)) {
            console.log("not an array!");
            return 0; // Return 0 if book is not an array or undefined
        }
        const snackcount = book.filter(recipe => recipe.snack === true);

        return snackcount.length;
    }



    if (loading) {
        return (
            <Box
                bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'}
                flexGrow={1}
                color={'white'}
                p={3}
                height='auto'
            >

                <p>loading...</p>
            </Box>
        )
    }
    if (error) {
        console.log(error);
        return (
            <p>there was an error</p>
        )
    }




    return (
        //  flexGrow={1}
        <>
            <Box
                bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'}
                flexGrow={1}
                color={'white'}
                p={3}
                height='auto'
            >


                <h2>Lets Plan</h2>
                {/* how many meals would you like to plan */}
                <label htmlFor="mealCount">Number of meals to plan</label>
                <Input
                    type='number'
                    onChange={(e) => handleNumChange(e)}
                    name="mealCount"
                    value={formState.mealCount}
                    min={0}
                    max={userData && userData?.book ? userData.book.length - snacks : 1}
                    bg={"white"}
                    color={"black"}
                ></Input>

                {/* would you like to plan snacks */}
                {/* how many */}
                <label htmlFor="snackCount">Number of snacks to plan</label>
                <Input
                    type='number'
                    onChange={(e) => handleNumChange(e)}
                    name="snackCount"
                    value={formState.snackCount}
                    min={0}
                    max={userData && userData?.book ? snacks : 0}
                    bg={"white"}
                    color={"black"}
                ></Input>

                {/* plan button */}
                <Button onClick={() => getPlan()} mt={3}>Plan!</Button>
                <ul>
                    {userData.plan ? userData.plan.map((recipe) => (
                        <li key={recipe.id} >
                            <Box>
                            <RecipeCard recipe={recipe} />
                            <IconButton icon={<GiRollingDices size={"lg"} />} h={10} w={10} onClick={() => getReroll(recipe.id)} />
                            <IconButton icon={<RxCross2 size={'lg'}/>} bg={'red'}  h={10} w={10} onClick={() => removeFromList(recipe.id)} />
                            </Box>
                        </li>


                    )) : <li>you havent generated a plan yet</li>}
                </ul>

                <Menu>
                    <MenuButton
                        px={4}
                        py={2}
                        transition='all 0.2s'
                        borderRadius='md'
                        borderWidth='1px'
                        bg={"colors.primarygreen"}
                        _hover={{ bg: 'green' }}
                        _expanded={{ bg: 'blue.400' }}
                        _focus={{ boxShadow: 'outline' }}
                    >
                        Add to plan from book
                    </MenuButton>
                    <MenuList bg={"cardlightblue"}>
                        {userData.book ? userData.book.map((recipe) => (

                            <Button key={recipe.id} onClick={() => addToPlan(recipe.id)} >
                                <MenuItem bg={"primarygreen"} >{recipe.title}</MenuItem>
                            </Button>
                        )) : null}

                    </MenuList>
                </Menu>
                <ShoppingList userData={userData} />

            </Box>
        </>
    );

}

export default Plan;