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

    Available libraries you can use in your component:
    ${getAvailableLibrariesInfo(config)}

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

  return styleGuide;
}

function getAvailableLibrariesInfo(config: GenerationConfig): string {
  if (!config.libraries || Object.keys(config.libraries).length === 0) {
    return `
No external libraries are available. Build components from scratch using:
- Standard React hooks (useState, useEffect, etc.)
- Basic HTML elements (div, button, input, etc.)
- Inline styles or Tailwind classes based on your styling configuration
- SVG or Unicode symbols for simple icons if needed
`;
  }

  let libraryInfo = "The following libraries are available for use:\n\n";

  for (const [libraryName, libraryExports] of Object.entries(
    config.libraries,
  )) {
    libraryInfo += `**${libraryName}**:\n`;

    if (libraryExports && typeof libraryExports === "object") {
      const exports = Object.keys(libraryExports);
      if (exports.length > 0) {
        libraryInfo += `- Available exports: ${exports.slice(0, 10).join(", ")}${exports.length > 10 ? "..." : ""}\n`;
        libraryInfo += `- Import syntax: import { ${exports[0]} } from '${libraryName}'\n`;
      } else {
        libraryInfo += `- Default import: import ${libraryName} from '${libraryName}'\n`;
      }
    } else {
      libraryInfo += `- Default import: import ${libraryName} from '${libraryName}'\n`;
    }
    libraryInfo += "\n";
  }

  libraryInfo += `
Guidelines for library usage:
- Only use the libraries listed above
- Use proper import syntax as shown
- Prefer named imports when available exports are listed
- If a library provides UI components, prefer using them over building from scratch
- If icon libraries are available, use them instead of SVG or Unicode symbols
`;

  return libraryInfo;
}
