import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Recipe = () => {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function Getdata() {

            const user = await fetch(`http://localhost:3001/api/recipe/${id}`, { method: 'get' }).then(response => {
                if (response.ok) {
                    console.log();
                    return response.json();
                }
                throw response;
            }).then(data => setData(data)).catch(err => {
                console.log("Error fetching data", err);
                setError(err);
            }).finally(() => setLoading(false));


            return user;
        }
        Getdata();
    }, []);



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

    console.log(data);
    return (
        <>
            <p>{data.title}</p>
            <h2>Ingredients</h2>
            <ul>
                {data.ingredients.map((ingredient) => (
                    <li key={ingredient} >
                        {ingredient}
                    </li>
                ))}
            </ul>
            <p>{data.instructions}</p>
        </>
    );

}

export default Recipe;