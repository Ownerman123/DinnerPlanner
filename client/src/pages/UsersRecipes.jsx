import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeStuff/RecipeCard"
import { useAuth } from "../auth/useAuth"



const UsersRecipes = () => {

    const { user } = useAuth();


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            if(user){

                
                const recipes = await fetch(`http://localhost:3001/api/recipe/user/${user.id}`, { method: 'get' }).then(response => {
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
            <p>loading...</p>
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
        <>
            
            <h2>Recipes</h2>
            <ul>
                {data ? data.map((recipe) => (
                    <li key={recipe.id} >
                        <RecipeCard recipe={recipe}/>
                    </li>
                    
                    
                )) : <li> nothin to see here</li> }
            </ul>
            
        </>
    );

}

export default UsersRecipes;