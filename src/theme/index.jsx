import { defaultTheme } from "@aws-amplify/ui-react";

export const myTheme = {
  name: "my-theme",
  overrides: [
    {
      colorMode: "dark",
      tokens: {
        colors: {
          neutral: {
            10: { value: defaultTheme.tokens.colors.neutral[100].value },
            20: { value: defaultTheme.tokens.colors.neutral[90].value },
            40: { value: defaultTheme.tokens.colors.neutral[80].value },
            80: { value: defaultTheme.tokens.colors.neutral[40].value },
            90: { value: defaultTheme.tokens.colors.neutral[20].value },
            100: { value: defaultTheme.tokens.colors.neutral[10].value },
          },
          black: { value: "#fff" },
          white: { value: "#000" },
        },
      },
    },
  ],
  tokens: {
    colors: {
      font: {
        primary: { value: "black" },
        secondary: { value: "black" },
        focus: { value: "hsl(37, 94%, 59%)" },
      },
      background: {},
      brand: {
        //Main Button State
        primary: {
          80: { value: "hsl(37, 94%, 59%)" },
          10: { value: "hsl(37, 62%, 46%)" },
        },
      },
      border: {}
    },
  },
};

//80: Initial
