import { extendTheme } from "@chakra-ui/react";
import { buttonTheme } from "./ButtonTheme";


const theme = extendTheme({
    colors: {

        white: "#FFFFFF",
        orange: "#FEA43C",
        red: "#F9213B",
        cyan: "#00FFFF",
        purple: "#7A52FF",
        yellow: "#ECFF77",
        green: "#36802A",
        darkgreen: "#20491C",
        lightgrey: "#383838",
        grey: "#1f1f1f",
        darkgrey: "#000000",
        gradorange: "#D38933",
        gradred: "#C31932",
        gradcyan: "#00CCCC",
        gradpurple: "#6342CC",
        gradyellow: "#B4CC60",
        gradgreen: "#2A6623",
        xhex: "#333333",
        linkedinhex: "#0077B5",
        githubhex: "#4183C4",
        youtubehex: "#FF0000",

        // chats colors light mode

        primaryGreen: "#6BCB77",  // Fresh Green: Highlighting buttons or healthy sections
        primaryOrange: "#FFA45B", // Sunny Orange: Energetic, for motivation and citrus ingredients
        secondaryRed: "#FF6F61",  // Warm Red: Action buttons, enthusiasm, tomatoes/berries
        secondaryYellow: "#FFD166", // Soft Yellow: Backgrounds/icons, cheerful and warm
        accentAqua: "#4ECDC4",    // Light Aqua: Accents, notifications, refreshing feel
        accentBlue: "#2A4D69",    // Deep Blue: Text/icons, contrast, and depth
        neutralWhite: "#F7FFF7",  // Cream White: Main background, clean and bright
        neutralGray: "#EAEAEA",

        // chats darkmode
        
        daccentBlue: "#1B6F8A",    // Deep Teal: Depth for icons, subtle highlights
        dneutralWhite: "#E0E0E0",  // Soft White: Primary text, essential UI elements
        dneutralGray: "#4F4F4F",   // Light Gray: Disabled states, borders, subtle separation
        fillgrey: "#121212", // Dark Charcoal: Main background, deep neutral base
        containerGray: "#2C2C2C"  // Muted Gray: Secondary backgrounds, cards, containers
    },
    components: {
        Button: buttonTheme,
    },
});
export default theme;
