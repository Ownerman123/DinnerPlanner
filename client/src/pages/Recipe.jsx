import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Button } from "@chakra-ui/react";


const Recipe = () => {

    const {user, isLoggedIn, setUser} = useAuth();

    const { id } = useParams();
    const [data, setData] = useState(null);
   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            if(id){

                
                const recipe = await fetch(`http://localhost:3001/api/recipe/${id}`, { method: 'get' }).then(response => {
                if (response.ok) {
                    console.log();
                    return response.json();
                }
                throw response;
            }).then(data => setData(data)).catch(err => {
                console.log("Error fetching data", err);
                setError(err);
            }).finally(() => setLoading(false));
            
            
            return recipe;
        }
        }
        Getdata();
    }, [user]);



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
    const handleAddToBook = async () => {
        if(user){

            const recipe = await fetch(`http://localhost:3001/api/user/book`,
                { 
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user: user.id, recipeId: id}) 
                }
            )
            const updatedUserbook = user.book.push(id);
            setUser({...user, book: updatedUserbook});
            isRecipeInBook = true;
            
            
            return recipe;
        }
    }
    const handleRemoveFromBook = async () => {
        const recipe = await fetch(`http://localhost:3001/api/user/book`,
             { 
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: user.id, recipeId: id}) 
            }
        )
        const updatedUserbook = user.book.filter(item => item !== id);
        setUser({...user, book: updatedUserbook});
        isRecipeInBook = false;
        

        return recipe;
    }

    let isRecipeInBook = user?.book?.includes(id); // Check if recipe is in user's book

const addToBookButton = isLoggedIn ? (
  <Button onClick={isRecipeInBook ? handleRemoveFromBook : handleAddToBook}>
    {isRecipeInBook ? "Remove from Book" : "Add to Book"}
  </Button>
) : null;

   // console.log(data);
    return (
        <>
            <p>{data.title}</p>
            {addToBookButton}
            <h2>Ingredients</h2>
            <ul>
                {data.ingredients.map((ingredient) => (
                    <li key={ingredient.name} >
                        {ingredient.name + ' ' + ingredient.amount + ' ' +ingredient.unit}
                    </li>
                ))}
            </ul>
            <p>{data.instructions}</p>
        </>
    );

}

export default Recipe;