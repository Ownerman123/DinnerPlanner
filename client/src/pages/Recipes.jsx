import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeStuff/RecipeCard"
import SearchBar from "../components/common/SearchBar";
import { Box } from "@chakra-ui/react";
import RecipePages from "../components/recipeStuff/RecipePages";

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const Recipes = () => {


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            const recipes = await fetch(`${API}/api/recipe`, { method: 'get' }).then(response => {
                if (response.ok) {

                    return response.json();
                }
                throw response;
            }).then(data => {
                setData(data);
              //  console.log(data);

            }).catch(err => {
                console.log("Error fetching data", err);
                setError(err);
            }).finally(() => setLoading(false));


            return recipes;
        }
        Getdata();
    }, []);



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

    // console.log(data);
    return (

        <>
            <Box
                bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'}
                flexGrow={1}
                color={'white'}
                p={3}
                height='auto'
            >

                <SearchBar setRecipeData={(e) => setData(e)}></SearchBar>

                <RecipePages recipes={data}></RecipePages>

                {/* <h2>recipes</h2>
            <ul>
                {data ? data.map((recipe) => (
                    <li key={recipe.id} >
                        <RecipeCard recipe={recipe}/>
                    </li>
                    
                    
                )) : <li> nope</li> }
            </ul> */}

            </Box>
        </>
    );

}

export default Recipes;