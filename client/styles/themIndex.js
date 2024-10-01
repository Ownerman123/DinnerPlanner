import { extendTheme,  } from "@chakra-ui/react";
import { buttonTheme } from "./ButtonTheme";
import { menuTheme } from "./MenuTheme";



const theme = extendTheme({
    colors: {

       bglightblue: '#9fc0d1',
       bgmidblue: '#608da4',
       trimbluegrey: '#1f2732',
       offwhite: '#edece8',
       cardlightblue: '#c8dce7',

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
        
        Menu: menuTheme
    },
});
export default theme;
