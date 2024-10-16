import { useEffect, useState } from "react";
import { Heading ,Select,Input, InputGroup, InputRightAddon, Button, Checkbox,Text } from "@chakra-ui/react";
import PropTypes from 'prop-types';

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const ShoppingList = ({userData}) => {

    const [itemInputs, setItemInputs] = useState(convertGroupedToUngrouped(userData.miscShopingList));
    const [mealList, setMealList] = useState([]);
    const [miscList, setMiscList] = useState([]);

    useEffect(() => {


        
                    setMealList([...userData.planShopingList]);
                    setMiscList([...userData.miscShopingList]);

                

        
    }, [userData]);

    function convertGroupedToUngrouped(items) {
        const ungroupedItems = [];
      
        // Loop through each ingredient
        items.forEach(item => {
          // Loop through each amount in the amounts array
          item.amounts.forEach(amountObj => {
            // Create a new ingredient object with ungrouped amounts
            ungroupedItems.push({
              name: item.name,
              amount: amountObj.amount,
              unit: amountObj.unit,
              checked: item.checked || false, // default to false if not defined
            });
          });
        });
      
        return ungroupedItems;
      }
      

    const saveMiscList = async () => {
        await fetch(`${API}/api/user/list/misc`, {
            method:"put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: userData._id, list: miscList})
        }).then(response => {
                    
            if (response.ok) {
                
                return response.json();
            }
            throw response;
        }).then(() => {
            window.location.reload();
           
            
            
        }).catch(err => {
            console.log("Error fetching data", err);
            
        });
    }

    const addItem = () => {
        setItemInputs([...itemInputs, {name:'', amount:'', unit:'lb'}]); // Add an empty string to the inputs array
        
    };
    const removeItem = (index) => {
        const newInputs = itemInputs.filter((_, i) => i !== index);
        setItemInputs(newInputs);
        setMiscList(
            [...newInputs]
        );
        console.log(miscList);
    };

    const handleItemInputChange = (index, value) => {
        const newInputs = [...itemInputs];
        newInputs[index] = { ...newInputs[index], name: value.toLowerCase() };
        setItemInputs(newInputs);
        setMiscList(
            [...newInputs]
        );
        console.log(miscList);
    };
    const handleAmountInputChange = (index, value) => {
        const newInputs = [...itemInputs];
        newInputs[index] = { ...newInputs[index], amount: value };
        setItemInputs(newInputs);
        setMiscList(
            [...newInputs]
        );
        console.log(miscList);
    };
    const handleUnitInputChange = (index, value) => {
        const newInputs = [...itemInputs];
        newInputs[index] = { ...newInputs[index], unit: value };
        setItemInputs(newInputs);
        setMiscList(
            [...newInputs]
        );
        console.log(miscList);
    };
    const handleCheck = (index,) =>{
        console.log('chcekcing');
        const newlist = [...mealList];
        newlist[index] = {...newlist[index], checked: !newlist[index].checked}
        setMealList([...newlist]);
    }

    
    return (
        <>
            <Heading>Planned meals shopping list</Heading>
            <ul>
                {mealList ? mealList.map((item , index) => (
                    <li key={item.name}>
                        <Text fontSize='sm' as={item.checked ? 'del' : null}>
                            {item.name} {item.amounts.map((amount) => (<span key={amount.unit}>
                {amount.amount} {amount.unit}
                {amount !== item.amounts.length - 1 && ", "}
              </span>)) }
                            </Text>
              
              <Checkbox defaultValue={item.checked} onChange={()=>handleCheck(index)}/>
                    </li>
                    
                    
                )) : <li> nope</li> }
            </ul>

            <Heading>Misc shopping list</Heading>
            <ul>
            {itemInputs.map((input, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <InputGroup>
                            <Input
                                type="text"
                                value={input.name}
                                minWidth={20}
                                maxWidth={500}
                                required = {true}
                                onChange={(e) => handleItemInputChange(index, e.target.value)}
                                placeholder="Item"
                                bg={"white"}
                                color={"black"}
                            />
                            <InputRightAddon minWidth='fit-content' pw={1} borderTopRightRadius={7} borderBottomRightRadius={7} bg={'trimbluegrey'}>
                                <Input
                                    type="number"
                                    value={input.amount}
                                    variant="unstyled"
                                    width={10}
                                    placeholder="0.00"
                                    onChange={(e) => handleAmountInputChange(index, e.target.value)}
                                />
                                <Select title='Units' value={input.unit} variant="unstyled" width="fit-content" onChange={(e) => handleUnitInputChange(index, e.target.value)}>
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
                                <button type="button" onClick={() => removeItem(index)}>
                                    Remove
                                </button>
                            </InputRightAddon>
                        </InputGroup>
                    </div>
                ))}
            </ul>
            <Button onClick={addItem} mr={3}>+item</Button>
            <Button onClick={saveMiscList}>Save list</Button>

        </>
    );

}

ShoppingList.propTypes = {
    userData: PropTypes.object,
}

export default ShoppingList;