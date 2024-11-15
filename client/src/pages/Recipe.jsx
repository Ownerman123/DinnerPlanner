import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Box, Image, Container, Button, HStack, Heading, Text } from "@chakra-ui/react";

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const Recipe = () => {

    const { user, isLoggedIn } = useAuth();

    const { id } = useParams();
    const [recipeData, setRecipeData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRecipeInBook, setRecipeInBook] = useState(false);
    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const response = await fetch(`${API}/api/recipe/${id}`);
                if (!response.ok) throw response;
                const data = await response.json();
                setRecipeData(data);
            } catch (err) {
                console.log("Error fetching recipe data", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`${API}/api/user/book/${user._id}`);
                    if (!response.ok) throw response;
                    const data = await response.json();
                    setUserData(data);
                    // Check if the recipe is already in the user's book
                    setRecipeInBook(data.book?.includes(id));
                } catch (err) {
                    console.log("Error fetching user data", err);
                    setError(err);
                }
            }
        };

        fetchRecipeData();
        fetchUserData();
    }, [user, id]);



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
    const handleAddToBook = async () => {
        if (userData) {

            const updatedUser = await fetch(`${API}/api/user/book`,
                {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: user.id, recipeId: id })
                }
            ).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            }).then(data => {
               // console.log("set user after adition", data);
                setUserData(data);
               // console.log(userData);
                setRecipeInBook(data.book?.includes(id));
               // console.log("set recipe in book to", isRecipeInBook);
            }).finally(() => {

            });

            return updatedUser;
        }
    }
    const handleRemoveFromBook = async () => {
        const updatedUser = await fetch(`${API}/api/user/book`,
            {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: user.id, recipeId: id })
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw response
        }).then(data => {
           // console.log("set user after removal", data);
            setUserData(data);
           // console.log(userData);
            setRecipeInBook(data.book?.includes(id));
           // console.log("set recipe in book to", isRecipeInBook);
        }).finally(() => {

        });


        return updatedUser;
    }

    const handleDeleteRecipe = async () => {
        const updatedUser = await fetch(`${API}/api/recipe/${recipeData._id}`,
            {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },

            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw response
        }).then(data => {

          //  console.log(data);

        }).finally(() => {
            window.location.assign('/userrecipes');
        });


        return updatedUser;
    }

    const handleEditRecipe = () => {
        window.location.assign(`/editrecipe/${recipeData._id}`)
    }



    const addToBookButton = isLoggedIn ? (
        <Button onClick={isRecipeInBook ? handleRemoveFromBook : handleAddToBook}>
            {isRecipeInBook ? "Remove from Book" : "Add to Book"}
        </Button>
    ) : null;

    const deleteRecipeButton = user?.id && recipeData?.author?.id && user.id === recipeData.author.id ? (
        <Button onClick={handleDeleteRecipe}>
            Delete Recipe?
        </Button>
    ) : null;
    const editRecipeButton = user?.id && recipeData?.author?.id && user.id === recipeData.author.id ? (
        <Button onClick={handleEditRecipe}>
            Edit Recipe?
        </Button>
    ) : null;

    // console.log(data);
    return (
        //  flexGrow={1}
        <Box flexGrow={1} bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'}>
            <HStack>
                <Heading>{recipeData.title}</Heading>
                {addToBookButton}
                {deleteRecipeButton}
                {editRecipeButton}
            </HStack>
            <Container centerContent>
                
            <Image  src={recipeData?.imgUrl ? `${recipeData.imgUrl}` : 'https://placehold.co/600x600'}
        maxBlockSize={'500px'}
        alt={recipeData.title}
        p={3}/>
        </Container>
            <Heading>Ingredients</Heading>
            <Container bg={'cardlightblue'} borderRadius={'lg'} p={2}>

                <ul>
                    {recipeData.ingredients.map((ingredient) => (
                        <li key={ingredient.name} >
                            {ingredient.name + ' ' + ingredient.amount + ' ' + ingredient.unit}
                        </li>
                    ))}
                </ul>
            </Container>
            <Heading>Instructions</Heading>
            <Container bg={'cardlightblue'} borderRadius={'lg'} p={2}>
                <Text>
                    {recipeData.instructions}
                </Text>
            </Container>
            {recipeData.author?.username ? `Author: ${recipeData.author.username}` : null}
        </Box>
    );

}

export default Recipe;