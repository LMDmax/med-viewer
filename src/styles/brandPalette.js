const brandPalette = {
  green: {
    50: "#e4ffdd",
    100: "#bcffaf",
    200: "#92ff7e",
    300: "#67ff4c",
    400: "#3eff1a", // this is the color
    500: "#24e600",
    600: "#18b300",
    700: "#0d8000",
    800: "#034e00",
    900: "#001c00",
  },
  pastelBlue: {
    50: "#e5f6ff", // This is the color
    100: "#bae3fa",
    200: "#8dd2f8",
    300: "#64c0f6",
    400: "#46aef5",
    500: "#3894dc",
    600: "#2b73aa",
    700: "#1e5279",
    800: "#0e3249",
    900: "#00111a",
  },
  pastelGreen: {
    50: "#e9fcf4", // This is the color
    100: "#c2f5de",
    200: "#99eec9",
    300: "#71e8b3",
    400: "#4fe19e",
    500: "#3cc886",
    600: "#2f9b68",
    700: "#226f4a",
    800: "#13422d",
    900: "#03160e",
  },
  pastelPurple: {
    50: "#ebe7fe", // This is the color
    100: "#c2b7f7",
    200: "#9b86f3",
    300: "#7456f1",
    400: "#4e28ed",
    500: "#3712d4",
    600: "#2b0da4",
    700: "#1f0875",
    800: "#120446",
    900: "#050118",
  },
  pink: {
    50: "#ffe2ff",
    100: "#ffb1ff",
    200: "#ff7ffb",
    300: "#ff4cf8",
    400: "#ff1af5",
    500: "#e600dc", // The color
    600: "#b400ac",
    700: "#81007b",
    800: "#4f004b",
    900: "#1e001c",
  },
  teal: {
    50: "#d7fffc",
    100: "#abfff2",
    200: "#7bffe9",
    300: "#48ffe0",
    400: "#1affd7",
    500: "#00e6bd", // The color
    600: "#00b393",
    700: "#008069",
    800: "#004e3f",
    900: "#001c15",
  },
  yellow: {
    50: "#ffffda",
    100: "#feffad",
    200: "#feff7d",
    300: "#feff4b",
    400: "#fdff1a",
    500: "#e4e600", // The color
    600: "#b1b300",
    700: "#7e8000",
    800: "#4c4d00",
    900: "#191b00",
  },
};

export const brandColors = [
  {
    label: "green",
    hex: brandPalette.green["500"],
  },
  {
    label: "pink",
    hex: brandPalette.pink["500"],
  },
  {
    label: "teal",
    hex: brandPalette.teal["500"],
  },
  {
    label: "yellow",
    hex: brandPalette.yellow["300"],
  },
  {
    label: "pastelBlue",
    hex: brandPalette.pastelBlue["50"],
  },
  {
    label: "pastelGreen",
    hex: brandPalette.pastelGreen["50"],
  },
  {
    label: "pastelPurple",
    hex: brandPalette.pastelPurple["50"],
  },
];

export default brandPalette;
