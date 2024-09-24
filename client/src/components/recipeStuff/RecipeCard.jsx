import PropTypes from "prop-types";
import { Link } from "react-router-dom";


const RecipeCard = ({recipe}) => {

 
 



  return (
        
        <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
  )
     
}

RecipeCard.propTypes = {
  recipe: PropTypes.object,
}

export default RecipeCard;