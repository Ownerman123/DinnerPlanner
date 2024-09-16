
import { Link } from "react-router-dom";


const RecipeCard = ({recipe}) => {

 
 



  return (
        
        <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
  )
     
}

export default RecipeCard;