import { useEffect, useState } from "react";
import RecipeCard from "../components/recipeStuff/RecipeCard"
import { useAuth } from "../auth/useAuth"

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const MyBook = () => {

    const { user } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {
            
            if(user){
                
                const recipes = await fetch(`${API}/api/recipe/book/${user._id}`, { method: 'get' }).then(response => {
                   
                    if (response.ok) {
                        
                        return response.json();
                    }
                    throw response;
                }).then(data => {
                    setData(data);
                    console.log(data);
                    
                }).catch(err => {
                    console.log("Error fetching data", err);
                    setError(err);
                }).finally(() => setLoading(false));
                
                
                return recipes;
            }
            }
            Getdata();
        },[user]);
        


    if (loading) {
        return (
            <p>loading...</p>
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

            <h2>recipes</h2>
            <ul>
                {data ? data.map((recipe) => (
                    <li key={recipe.id} >
                        <RecipeCard recipe={recipe} />
                    </li>


                )) : <li> nope</li>}
            </ul>

        </>
    );

}

export default MyBook;