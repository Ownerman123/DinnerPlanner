import RecipeCard from "./RecipeCard";
import { HStack, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";

const RecipePages = ({ recipes }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 10;

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    if(recipes.message){
        return (
            <p>{recipes.message}</p>
        )
    }
    const currentRecipes = recipes.slice(
        indexOfFirstRecipe,
        indexOfLastRecipe
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <VStack spacing={4} align="stretch">
            {currentRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
            <HStack justifyContent="center" spacing={2}>
                {Array.from({
                    length: Math.ceil(recipes.length / recipesPerPage),
                }).map((_, index) => (
                    <Button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        bg={'trimbluegrey'}
                        variant={currentPage === index + 1 ? "currentpage" : "otherpages"}
                        colorScheme={currentPage === index + 1 ? "bgmidblue" : "white"}
                    >
                        {index + 1}
                    </Button>
                ))}
            </HStack>
        </VStack>
    );
};

export default RecipePages;