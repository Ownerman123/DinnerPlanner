import { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Box, Wrap, Container, Button, Stack, Image, Input, Textarea, FormControl, FormLabel, Select, InputRightAddon, InputGroup, Checkbox, ButtonGroup, IconButton, } from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons"
import { useAuth } from "../auth/useAuth"
import imageCompression from 'browser-image-compression';

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const EditRecipe = () => {


    const { id } = useParams();
    const { user } = useAuth();


    const [formState, setFormState] = useState({
        title: "",
        image: null,
        instructions: "",
        ingredients: [{}],
        tags: [],
        snack: false
    });
    const [ingredientInputs, setIngredientInputs] = useState([{ name: '', amount: '', unit: 'lb' }]);
    const [tagInputs, setTagInputs] = useState([]);
    const [tag, setTag] = useState('');
    const [fetching, setfetching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipeData, setRecipeData] = useState(null);
    const [previewImg, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const response = await fetch(`${API}/api/recipe/${id}`);
                if (!response.ok) throw response;
                const data = await response.json();
                setRecipeData(data);
                setFormState(data);
                setIngredientInputs([...data.ingredients])
                setTagInputs([...data.tags])
                console.log(data, user);
                
            } catch (err) {
                console.log("Error fetching recipe data", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };


        fetchRecipeData();

    }, [user, id]);

    const addIngredient = () => {
        setIngredientInputs([...ingredientInputs, { name: '', amount: '', unit: 'lb' }]); // Add an empty string to the inputs array

    };
    const addTag = (newtag) => {
        setTagInputs([...tagInputs, newtag]);
        setFormState({
            ...formState,
            tags: [...tagInputs, newtag],
        });
        setTag('');
        //console.log(formState);
    };

    const removeTag = (index) => {
        const newTags = tagInputs.filter((_, i) => i !== index);
        setTagInputs(newTags);
        setFormState({
            ...formState,
            tags: newTags,
        });
        //console.log(formState);
    };
    const removeIngredient = (index) => {
        const newInputs = ingredientInputs.filter((_, i) => i !== index);
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        //console.log(formState);
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
       // console.log(formState);
    };
    const handleAmountInputChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], amount: value };
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        //console.log(formState);
    };
    const handleUnitInputChange = (index, value) => {
        const newInputs = [...ingredientInputs];
        newInputs[index] = { ...newInputs[index], unit: value };
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        //console.log(formState);
    };
    const handleSnackChange = () => {
        setFormState
        setFormState({
            ...formState,
            snack: !formState.snack,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormState({ ...formState, image: file });
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const saveRecipe = async () => {
        let base64Image = null;
        if (formState.image) {

            const options = {
                maxSizeKB: 40, // Max file size (in MB)
                maxWidthOrHeight: 200, // Max width or height in pixels
                useWebWorker: true, // Optional: enable web worker for faster processing
            };

            const compressed = await imageCompression(formState.image, options)
            base64Image = await toBase64(compressed);
        }
        const justTagNames = { ...formState, tags: formState.tags.map((tag) => (tag?.tag ? tag.tag : tag)) }
        const noEmpys = { ...justTagNames, ingredients: justTagNames.ingredients.filter(ingredient => ingredient.name !== '') };
        const noIds = { ...noEmpys, ingredients: noEmpys.ingredients.map((ingredient) => ({ amount: ingredient.amount, name: ingredient.name, unit: ingredient.unit })) }
       // console.log("no empy", noIds);
        try {

            setfetching(true);
            const updatedRecipe = await fetch(`${API}/api/recipe`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...noIds, author: user._id, image: base64Image })
            });
            const data = await updatedRecipe.json();

            setfetching(false);

            window.location.assign(`/recipe/${data._id}`);
            return updatedRecipe;
        } catch (err) {
            setfetching(false);
            console.log("bad", err);
        }
    }



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

    if( recipeData.author.id !== user.id){
       return  <Navigate to="/tchtch" replace />
    }

    return (
        <Box
            bg={'radial-gradient(circle at top left, #9fc0d1, #608da4)'}
            flexGrow={1}
            color={'white'}
            p={3}
            height='auto'
        >
            <Container flexGrow={1}>

                <FormControl isRequired>
                    <FormLabel color={'black'}>Meal Title</FormLabel>
                    <Input
                        maxWidth={720}
                        borderColor={"black"}
                        placeholder="Title"
                        type="text"
                        name="title"
                        bg='white'
                        color="black"
                        value={formState.title}
                        onChange={handleChange} />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="avatar">Cover Image</FormLabel>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        display="none"
                    />
                    <Button onClick={() => fileInputRef.current.click()}>
                        Choose File
                    </Button>
                    {previewImg && (
                        <Image
                            src={previewImg}
                            alt="image preview"
                            boxSize="100px"
                            mt={2}
                        />
                    )}

                </FormControl>
                <FormControl isRequired>
                    <FormLabel color={"black"} pt={3}>Instructions</FormLabel>
                    <Textarea
                        maxWidth={720}
                        borderColor={"black"}
                        bg='white'
                        color="black"
                        placeholder="instructions"
                        type="text"
                        name="instructions"
                        value={formState.instructions}
                        onChange={handleChange} />
                </FormControl>

                <FormLabel pt={3} color={"black"}>Ingredients</FormLabel>
                <Stack spacing={4} py={3}>
                    {ingredientInputs.map((input, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <InputGroup borderLeftRadius={7}>
                                <Input
                                    type="text"
                                    value={input.name}
                                    minWidth={20}
                                    maxWidth={500}
                                    borderColor={"black"}
                                    required={true}
                                    bg='white'
                                    color="black"
                                    onChange={(e) => handleIngredientInputChange(index, e.target.value)}
                                    placeholder="Ingredient"
                                />
                                <InputRightAddon color={'white'}
                                    minWidth='fit-content' pw={1}
                                    bg={'trimbluegrey'}
                                    borderRightRadius={7}
                                    border={'nopne'}
                                >
                                    <Input
                                        type="number"
                                        value={input.amount}
                                        variant="unstyled"
                                        width={10}
                                        placeholder="0.00"

                                        color={"white"}

                                        onChange={(e) => handleAmountInputChange(index, e.target.value)}
                                    />
                                    <Select title='Units' color="white" value={input.unit} variant="unstyled" width="fit-content" onChange={(e) => handleUnitInputChange(index, e.target.value)}>
                                        <option style={{ color: "black" }} value="lb">lb</option>
                                        <option style={{ color: "black" }} value="can">can</option>
                                        <option style={{ color: "black" }} value="cup">cup</option>
                                        <option style={{ color: "black" }} value="gram">gram</option>
                                        <option style={{ color: "black" }} value="kilogram">kilogram</option>
                                        <option style={{ color: "black" }} value="pinch">pinch</option>
                                        <option style={{ color: "black" }} value="tsp">tsp</option>
                                        <option style={{ color: "black" }} value="tbsp">tbsp</option>
                                        <option style={{ color: "black" }} value="fl oz">fl oz</option>
                                        <option style={{ color: "black" }} value="mL">mL</option>
                                        <option style={{ color: "black" }} value="oz">oz</option>
                                        <option style={{ color: "black" }} value="small">small</option>
                                        <option style={{ color: "black" }} value="medium">medium</option>
                                        <option style={{ color: "black" }} value="large">large</option>
                                        <option style={{ color: "black" }} value="count">count</option>

                                    </Select>
                                    <button type="button" onClick={() => removeIngredient(index)}>
                                        Remove
                                    </button>
                                </InputRightAddon>
                            </InputGroup>
                        </div>
                    ))}
                </Stack>

                <Button variant="colored" colorScheme="trimbluegrey" onClick={addIngredient}>+ingredient</Button>
                <FormLabel color={"black"} pt={3}>Tags</FormLabel>
                <InputGroup width={20} borderRadius={7}>
                    <Input type="text"
                        value={tag}
                        minWidth={20}
                        maxWidth={500}
                        bg='white'
                        color="black"
                        borderColor={"black"}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="tag"
                    />

                    <IconButton aria-label='add tag' bg={'trimbluegrey'} variant={"iconButt"} colorScheme="trimbluegrey" icon={<AddIcon color={"white"} />} onClick={() => addTag(tag)} />

                </InputGroup>

                <Stack>
                    <Wrap>

                        {tagInputs.map((input, index) => (
                            <div key={index}>
                                <ButtonGroup size='sm' isAttached p={2}>
                                    <Button bg="white" color="black">{input?.tag ? input.tag : input}</Button>
                                    <IconButton aria-label='remove tag' bg={'trimbluegrey'} icon={<CloseIcon color="white" />} onClick={() => removeTag(index)} />
                                </ButtonGroup>

                            </div>
                        ))
                        }
                    </Wrap>
                    <Checkbox pt={3} isChecked={formState.snack} onChange={handleSnackChange}>This is a snack</Checkbox>
                    <Button variant="colored" colorScheme="primaryGreen" disabled={fetching} onClick={saveRecipe} maxWidth={"3xs"} type="submit">Submit</Button>
                </Stack>

            </Container >
        </Box>
    );
}

export default EditRecipe;