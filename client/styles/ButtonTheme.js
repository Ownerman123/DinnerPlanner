import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
const baseStyle = defineStyle({
  fontWeight: "normal",
  fontFamily: "mono",
});
const sizes = {
  md: defineStyle({
    fontSize: "sm",
  }),
};

const colored = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontFamily: "sans-serif",
    bg: `${c}`,
    fontWeight: "semibold",
    color: `white`,
    borderRadius: "lg",
    borderColor: `${c}`,
    border: "1px",
    transition: "transform 0.15s ease-out, background 0.5s ease-out",
    _dark: {
      bg: `${c}`,
      color: "gray.800",
    },

    _hover: {
      transform: "scale(1.02, 1.02)",
      bg: `green`,
      

      _dark: {
        bg: `dark${c}`,
      },
    },

    _active: {
      bg: `${c}`,

      _dark: {
        bg: `${c}`,
      },
    },
  };
});
const currentpage = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontFamily: "sans-serif",
    borderColor: `${c}`,
    bg: `darkgrey`,
    borderWidth: "1px",
    boxShadow: "1px 1px 1px 1px ",
    fontWeight: "semibold",
    color: `white`,
    borderRadius: "lg",
    transition: "transform 0.15s ease-out, background 0.15s ease-out",

    _hover: {
      transform: "scale(1.02, 1.02)",
      borderColor: `${c}`,
      color: `${c}`,

      _dark: {
        bg: `dark${c}`,
      },
    },

    _active: {
      bg: `dark${c}`,

      _dark: {
        bg: `${c}`,
      },
    },
  };
});
const otherpages = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    fontFamily: "sans-serif",
    borderColor: `${c}`,
    bg: `darkgrey`,
    borderWidth: "1px",
    boxShadow: "1px 1px 1px 1px ",
    fontWeight: "semibold",
    color: "white",
    borderRadius: "lg",
    transition: "transform 0.15s ease-out, background 0.15s ease-out",

    _hover: {
      transform: "scale(1.02, 1.02)",
      borderColor: `${c}`,
      color: `${c}`,
    },

    _active: {
      bg: `dark${c}`,

      _dark: {
        bg: `${c}`,
      },
    },
  };
});

const iconButt = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    borderColor: 'offwhite',
    borderWidth: '1px',
    borderRadius: 'lg',
    
    _hover: {
      bg: "offwhite",
      borderColor: 'black',

    }
  }
});


export const buttonTheme = defineStyleConfig({
  baseStyle,
  sizes,
  variants: {
    colored: colored,
    currentpage: currentpage,
    otherpages: otherpages,
    iconButt: iconButt
  },
  defaultProps: {
    colorScheme: "green",
  },
});
