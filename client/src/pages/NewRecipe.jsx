import { useState, useRef } from "react";
import { Box, Wrap, Container, Button, Image, Stack, Input, Textarea, FormControl, FormLabel, Select, InputRightAddon, InputGroup, Checkbox, ButtonGroup, IconButton, } from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons"
import { useAuth } from "../auth/useAuth"
import imageCompression from 'browser-image-compression';

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const NewRecipe = () => {

    const { user } = useAuth();


    const [formState, setFormState] = useState({
        title: "",
        instructions: "",
        ingredients: [{}],
        tags: [],
        snack: false
    });
    const [ingredientInputs, setIngredientInputs] = useState([{ name: '', amount: '', unit: 'lb' }]);
    const [tagInputs, setTagInputs] = useState([]);
    const [tag, setTag] = useState('');
    const [fetching, setfetching] = useState(false);
    const [previewImg, setPreview] = useState(null);
    const fileInputRef = useRef(null);

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
       // console.log(formState);
    };
    const removeIngredient = (index) => {
        const newInputs = ingredientInputs.filter((_, i) => i !== index);
        setIngredientInputs(newInputs);
        setFormState({
            ...formState,
            ingredients: newInputs,
        });
        //(formState);
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
        //console.log(formState);
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


    const createNewRecipe = async () => {
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
        const noEmpys = { ...formState, ingredients: formState.ingredients.filter(ingredient => ingredient.name !== '') };
        //console.log("no empy", noEmpys);
        try {

            setfetching(true);
            const newRecipe = await fetch(`${API}/api/recipe`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...noEmpys, author: user._id, image: base64Image })
            });
            const data = await newRecipe.json();

            setfetching(false);
            if (data && data._id) {
                localStorage.setItem("test values", JSON.stringify(data));
                window.location.assign(`/recipe/${data._id}`);
            } else {
                console.error("No ID found in response data:", data);
            }
            return newRecipe;
        } catch (err) {
            setfetching(false);
            console.log("bad", err);
        }
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
                                    <Button bg="white" color="black">{input}</Button>
                                    <IconButton aria-label='remove tag' bg={'trimbluegrey'} icon={<CloseIcon color="white" />} onClick={() => removeTag(index)} />
                                </ButtonGroup>

                            </div>
                        ))
                        }
                    </Wrap>
                    <Checkbox pt={3} onChange={handleSnackChange}>This is a snack</Checkbox>
                    <Button variant="colored" colorScheme="primaryGreen" disabled={fetching} onClick={createNewRecipe} maxWidth={"3xs"} type="submit">Submit</Button>
                </Stack>

            </Container >
        </Box>
    );
}

export default NewRecipe;