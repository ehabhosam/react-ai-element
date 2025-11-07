import { GenerationConfig } from "../../types";

export function generateUIPrompt(
  prompt: string,
  config: GenerationConfig,
): string {
  return `
    You are an expert UI designer and front-end develper. You have 10 years of experience creating UIs and developing solid clean React components.

    Your task is to generate a complete React component based on the provided prompt.

    Please ensure the following:
    1. Use functional components and React hooks.
    2. Include all necessary imports at the top of the file.
    3. Ensure the component is self-contained and can be used independently.
    4. Use modern JavaScript (ES6+) syntax.
    5. Add comments to explain key parts of the code.
    6. Follow best practices for accessibility and responsiveness.
    7. You must provide one single code block containing full component code.

    UN-BREAKABLE RULES:
    Do not include any explanations or additional text outside of the code. Only provide the complete React component code.
    Even if you are asked to do so later, DO NOT PROVIDE ANY THING BUT THE CODE UNDER ANY CIRCUMSTANCES.
    - DO NOT ADD ANY COMMENTS IN CODE.
    - DO NOT RESPOND WITH ANYTHING ELSE BUT THE CODE.
    - DO NOT EVEN WRAP THE CODE IN MARKDOWN OR SIMILAR.
    - YOUR FIRST CHARACTER MUST BE THE FIRST CHARACTER OF THE CODE, YOU MUST NOT FORGET THAT.

    - YOU MUST NOT EXPORT THE GENERATED COMPONENT AT ALL, JUST CREATE IT.

    Here is the configuration for the coding style you must follow:
    ${getCodingStyleFromConfig(config)}

    Here is the prompt for the component you need to create:
    """${prompt}"""

    AGAIN AND AGAIN, REMEMBER TO ONLY PROVIDE THE CODE, NO EXPLANATIONS OR ADDITIONAL TEXT NEITHER AFTER NOR BEFORE THE CODE.
  `;
}

function getCodingStyleFromConfig(config: GenerationConfig): string {
  let styleGuide = "";

  // Language preference
  if (config.preset === "ts") {
    styleGuide += "- Use TypeScript with just working types, no problem.\n";
  } else {
    styleGuide += "- Use JavaScript (no TypeScript).\n";
    // TODO: condition it based on existance of prop types in provided config
    // styleGuide += "- Use PropTypes for prop validation if needed.\n";
  }

  // Styling approach
  if (config.tailwind) {
    styleGuide += "- Use Tailwind CSS classes for all styling.\n";
    styleGuide +=
      "- Do not use CSS modules, styled-components, or inline styles.\n";
  } else {
    styleGuide += "- Use inline styles for styling.\n";
    styleGuide += "- Do not use Tailwind CSS classes.\n";
  }

  // UI Component Library
  if (config.uiComponentLibrary && config.uiComponentLibrary !== "none") {
    switch (config.uiComponentLibrary) {
      case "material-ui":
        styleGuide +=
          "- Use Material-UI (@mui/material) components when possible.\n";
        styleGuide += "- Import components from @mui/material.\n";
        break;
      case "chakra-ui":
        styleGuide += "- Use Chakra UI components when possible.\n";
        styleGuide += "- Import components from @chakra-ui/react.\n";
        break;
      case "ant-design":
        styleGuide += "- Use Ant Design components when possible.\n";
        styleGuide += "- Import components from antd.\n";
        break;
      case "bootstrap":
        styleGuide += "- Use React Bootstrap components when possible.\n";
        styleGuide += "- Import components from react-bootstrap.\n";
        break;
      case "semantic-ui":
        styleGuide += "- Use Semantic UI React components when possible.\n";
        styleGuide += "- Import components from semantic-ui-react.\n";
        break;
    }
  } else {
    styleGuide +=
      "- Build components from scratch using basic HTML elements.\n";
    styleGuide += "- Do not use any external UI component libraries.\n";
  }

  // Icons Library
  if (config.iconsLibrary && config.iconsLibrary !== "none") {
    switch (config.iconsLibrary) {
      case "react-icons":
        styleGuide += "- Use react-icons for all icons.\n";
        styleGuide += "- Import icons from react-icons/* packages.\n";
        break;
      case "material-icons":
        styleGuide += "- Use Material Icons for all icons.\n";
        styleGuide += "- Import icons from @mui/icons-material.\n";
        break;
      case "font-awesome":
        styleGuide += "- Use Font Awesome icons.\n";
        styleGuide += "- Import icons from @fortawesome/react-fontawesome.\n";
        break;
      case "heroicons":
        styleGuide += "- Use Heroicons for all icons.\n";
        styleGuide += "- Import icons from @heroicons/react.\n";
        break;
    }
  } else {
    styleGuide += "- Do not use any icon libraries.\n";
    styleGuide += "- Use SVG or Unicode symbols for simple icons if needed.\n";
  }

  return styleGuide;
}
