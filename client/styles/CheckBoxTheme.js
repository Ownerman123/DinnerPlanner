import { checkboxAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
 
  control: {
    padding: 1, // change the padding of the control
    borderRadius: 0, // change the border radius of the control
    borderColor: 'black',
  },
})

export const checkboxTheme = defineMultiStyleConfig({ baseStyle })