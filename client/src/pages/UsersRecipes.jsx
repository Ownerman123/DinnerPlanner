import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeStuff/RecipeCard"
import { useAuth } from "../auth/useAuth"
import { Box } from "@chakra-ui/react";

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const UsersRecipes = () => {

    const { user } = useAuth();


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            if(user){

                
                const recipes = await fetch(`${API}/api/recipe/user/${user.id}`, { method: 'get' }).then(response => {
                    if (response.ok) {
                        
                        return response.json();
                    }
                    throw response;
                }).then(data => {
                    setData(data);
                    
                    
                }).catch(err => {
                    console.log("Error fetching data", err);
                    setError(err);
                }).finally(() => setLoading(false));
                
                
                return recipes;
            }
        }
        Getdata();
    } ,[user]);



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
            <p>There was an error</p>
        )
    }

   // console.log(data);
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

            <h2>Recipes</h2>
            <ul>
                {data ? data.map((recipe) => (
                    <li key={recipe.id} >
                        <RecipeCard recipe={recipe}/>
                    </li>
                    
                    
                )) : <li> nothin to see here</li> }
            </ul>
            
                </Box>
        </>
    );

}

export default UsersRecipes;