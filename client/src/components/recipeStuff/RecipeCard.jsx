import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Box, Container, Image, Tag, Heading, HStack, Text } from "@chakra-ui/react";


const RecipeCard = ({ recipe }) => {

  const tags = recipe?.tags ? recipe.tags : recipe.populatedTags;




  return (
    <Box borderRadius={'lg'} bgColor={'cardlightblue'} color={'black'} m={5} p={2} boxShadow={'xl'}>
      <Link to={`/recipe/${recipe.id}`} p={2} ><Heading bg={'bgmidblue'} noOfLines={1} maxWidth={'100%'} borderRadius={'lg'} p={2} size={"md"}>{recipe.title}</Heading></Link>
      <HStack>

        <Image
          src={recipe?.imgUrl ? `${recipe.imgUrl}` : 'https://placehold.co/200x200'}
          boxSize='200px'
          alt={recipe.title}
          p={3}
        />
        <Text bg={"offwhite"} borderRadius={'lg'} p={5} noOfLines={4} flexGrow={1} h={'200px'} >{recipe.instructions} </Text>
      </HStack>
      <Container >
        {tags?.[0]?.tag ? <Tag m={1} bg={"trimbluegrey"} color={"offwhite"}>{tags[0].tag}</Tag> : null}
        {tags?.[1]?.tag ? <Tag m={1} bg={"trimbluegrey"} color={"offwhite"}>{tags[1].tag}</Tag> : null}
        {tags?.[2]?.tag ? <Tag m={1} bg={"trimbluegrey"} color={"offwhite"}>{tags[2].tag}</Tag> : null}
        {tags?.[3] ? `${tags.length - 3} more tags ...` : null}
      </Container>
      {recipe.author?.username ? <Text>By: {recipe.author.username}</Text> : null}
    </Box>
  )

}

RecipeCard.propTypes = {
  recipe: PropTypes.object,
}

export default RecipeCard;