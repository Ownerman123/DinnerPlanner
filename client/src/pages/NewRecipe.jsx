import { useState } from "react";
import { Button, Stack, Input, Textarea, FormControl, FormLabel, Select, InputLeftAddon, InputGroup, Checkbox , ButtonGroup, IconButton,} from "@chakra-ui/react";
import {CloseIcon, AddIcon} from "@chakra-ui/icons"
import { useAuth } from "../auth/useAuth"

const NewRecipe = () => {

    const { user } = useAuth();
    

    const [formState, setFormState] = useState({
        title: "",
        instructions: "",
        ingredients: [{}],
        tags: [],
        snack: false
    });
    const [ingredientInputs, setIngredientInputs] = useState([{name:'', amount:'', unit:'lb'}]);
    const [tagInputs, setTagInputs] = useState([]);
    const [tag, setTag] = useState('');

    const addIngredient = () => {
        setIngredientInputs([...ingredientInputs, {name:'', amount:'', unit:'lb'}]); // Add an empty string to the inputs array
        
    };
    const addTag = (newtag) => {
        setTagInputs([...tagInputs, newtag]); 
        setFormState({
            ...formState,
            tags: [...tagInputs, newtag],
        });
        setTag('');
        console.log(formState);
    };

    const removeTag = (index) => {
        const newTags = tagInputs.filter((_, i) => i !== index);
        setTagInputs(newTags);
        setFormState({
            ...formState,
            tags: newTags,
        });
        console.log(formState);
    };
    const removeIngredient = (index) => {
        const newInputs = ingredientInputs.filter((_, i) => i !== index);
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        console.log(formState);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    const handleIngredientInputChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], name: value.toLowerCase() };
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        console.log(formState);
    };
    const handleAmountInputChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], amount: value };
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        console.log(formState);
    };
    const handleUnitInputChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], unit: value };
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        console.log(formState);
    };
    const handleSnackChange = () => {
        setFormState
        setFormState({
            ...formState,
            snack: !formState.snack,
        });
    };

    const createNewRecipe = async () => {
        try {

            const newRecipe = await fetch("http://localhost:3001/api/recipe", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formState, author: user._id })
            });

            
            window.location.assign('/userrecipes');
            return newRecipe;
        }catch (err){

            console.log("bad", err);
        }
    }





    return (
        <>
            <FormControl isRequired>
                <FormLabel>Meal Title</FormLabel>
                <Input placeholder="Title" type="text" name="title" onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Instructions</FormLabel>
                <Textarea placeholder="instructions" type="text" name="instructions" onChange={handleChange} />
            </FormControl>

            <FormLabel>Ingredients</FormLabel>
            <Stack spacing={4} p={3}>
                {ingredientInputs.map((input, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <InputGroup>
                            <Input
                                type="text"
                                value={input.name}
                                minWidth={20}
                                maxWidth={500}
                                onChange={(e) => handleIngredientInputChange(index, e.target.value)}
                                placeholder="Ingredient"
                            />
                            <InputLeftAddon minWidth='fit-content' pw={1} borderTopRightRadius={7} borderBottomRightRadius={7}>
                                <Input
                                    type="number"
                                    value={input.amount}
                                    variant="unstyled"
                                    width={10}
                                    placeholder="0.00"
                                    onChange={(e) => handleAmountInputChange(index, e.target.value)}
                                />
                                <Select title='Units' value={input.unit} variant="unstyled" width="fit-content" onChange={(e) => handleUnitInputChange(index, e.target.value)}>
                                    <option value="lb">lb</option>
                                    <option value="can">can</option>
                                    <option value="cup">cup</option>
                                    <option value="gram">gram</option>
                                    <option value="kilogram">kilogram</option>
                                    <option value="pinch">pinch</option>
                                    <option value="tsp">tsp</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="fl oz">fl oz</option>
                                    <option value="mL">mL</option>
                                    <option value="oz">oz</option>
                                    <option value="small">small</option>
                                    <option value="medium">medium</option>
                                    <option value="large">large</option>
                                    <option value="count">count</option>

                                </Select>
                                <button type="button" onClick={() => removeIngredient(index)}>
                                    Remove
                                </button>
                            </InputLeftAddon>
                        </InputGroup>
                    </div>
                ))}
            </Stack>

            <Button onClick={addIngredient}>+ingredient</Button>
            <FormLabel>Tags</FormLabel>
            <InputGroup width={20}> 
            <Input  type="text"
                                value={tag}
                                minWidth={20}
                                maxWidth={500}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="tag"
                                 />
                                 <InputLeftAddon  borderTopRightRadius={7} borderBottomRightRadius={7}>
                                 <IconButton aria-label='add tag' icon={<AddIcon />} onClick={()=>addTag(tag)} />
                                 </InputLeftAddon>
            </InputGroup>
            
            <Stack>
                {tagInputs.map((input, index) => (
                    <div key={index}>
                        <ButtonGroup size='sm' isAttached variant='outline'>
                            <Button>{input}</Button>
                            <IconButton aria-label='remove tag' icon={<CloseIcon />} onClick={()=>removeTag(index)} />
                        </ButtonGroup>

                    </div>
                ))
                }
            </Stack>

            <Checkbox onChange={handleSnackChange}>This is a snack</Checkbox>
            <Button onClick={createNewRecipe} type="submit">Submit</Button>
        </>
    );
}

export default NewRecipe;