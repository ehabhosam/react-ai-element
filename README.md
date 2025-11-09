# react-ai-element

Runtime AI-generated React components from text prompts. Generate UI components on-the-fly using OpenAI, Anthropic or Google models.

## Quick Start

### 1. Install
```bash
npm install react-ai-element
```

### 2. Setup
```tsx
// ai-element.config.ts
import {
  createAIElement,
  GeminiModel,
  OpenaiModel,
  AnthropicModel
} from 'react-ai-element';

// Choose your AI model
const model = new GeminiModel('gemini-2.0-flash', 'your-api-key');
// or
// const model = new OpenaiModel('gpt-4', 'your-api-key');
// or
// const model = new AnthropicModel('claude-sonnet-4-5-20250929', 'your-api-key');

// Configure generation settings
const config = {
  preset: 'ts', // 'ts' or 'js'
  tailwind: true, // Use Tailwind CSS
  libraries: {
    // Register any libraries for AI to use
    'lodash': await import('lodash'),
    '@mui/material': await import('@mui/material'),
  }
};

export const AIElement = createAIElement(model, config);
```

### 3. Use in Your App
```tsx
import { AIElementSlot } from 'react-ai-element';
import { AIElement } from './ai-element.config';

function App() {
  return (
    <AIElementSlot>
      <AIElement
        prompt="Create a dashboard card showing user stats with a number and trend arrow"
        aiElementProps={{ value: 42150, trend: 12.5 }}
      />
    </AIElementSlot>
  );
}
```

## API Reference

### `createAIElement(model, config)`

Creates a configured AI element component.

**Parameters:**
- `model` - AI model instance (OpenaiModel, GeminiModel, AnthropicModel, or custom AIModel implementation)
- `config` - Generation configuration

**Returns:** Configured AIElement component

### `AIElement` Props

| Prop | Type | Description |
|------|------|-------------|
| `prompt` | `string` | Text description of the component to generate |
| `aiElementProps` | `object` | Props to pass to the generated component |
| `ErrorComponent` | `React.ComponentType` | Custom error fallback component |

### `AIElementSlot` Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | AIElement components |
| `height` | `string \| number` | Container height |
| `width` | `string \| number` | Container width |

### Generation Config

```tsx
interface GenerationConfig {
  preset: 'ts' | 'js';           // Language preference
  tailwind: boolean;             // Use Tailwind CSS classes
  libraries?: Record<string, any>; // Available libraries for AI
}
```

## AI Models

### OpenAI
```tsx
import { OpenaiModel } from 'react-ai-element';

const model = new OpenaiModel('gpt-4', 'sk-...');
```

### Google Gemini
```tsx
import { GeminiModel } from 'react-ai-element';

const model = new GeminiModel('gemini-2.0-flash', 'your-api-key');
```

### Anthropic Claude
```tsx
import { AnthropicModel } from 'react-ai-element';

const model = new AnthropicModel('claude-sonnet-4-5-20250929', 'your-api-key');
```

### Custom Models

You can create custom AI model implementations by extending the `AIModel` base class:

```tsx
import { AIModel } from 'react-ai-element';

class CustomModel extends AIModel<YourAIClient> {
  constructor(modelName: string, apiKey: string) {
    const client = new YourAIClient({ apiKey });
    super(modelName, client);
  }

  init(): void {
    // Initialize your AI client
    console.log(`Custom model ${this.getModelName()} initialized`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const client = this.getInstance();
      const response = await client.generate({
        model: this.getModelName(),
        prompt: prompt,
      });

      if (!response.text) {
        throw new Error("No content received from API");
      }

      return response.text;
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
}

// Use your custom model
const customModel = new CustomModel('your-model-name', 'your-api-key');
export const AIElement = createAIElement(customModel, config);
```

## Library Registration

Register any library for the AI to use in generated components:

```tsx
const config = {
  preset: 'ts',
  tailwind: false,
  libraries: {
    // UI Libraries
    '@mui/material': {
      Button: MuiButton,
      TextField: MuiTextField,
      Box: MuiBox
    },

    // Icon Libraries
    'react-icons/fa': {
      FaUser: FaUser,
      FaHome: FaHome
    },

    // Utility Libraries
    'lodash': {
      debounce: _.debounce,
      merge: _.merge
    },

    // Custom Libraries
    '@myapp/utils': {
      formatPrice: (price) => `$${price.toFixed(2)}`,
      formatDate: (date) => date.toLocaleDateString()
    }
  }
};
```

The AI will receive information about available exports and proper import syntax for each registered library.

## Custom UI Components

```tsx
import { Button } from '@componenets/ui'; // Import existing components
import React from 'react';

// Create custom components
const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', marginBottom: '8px' }}>{label}</label>}
    <input
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
      {...props}
    />
  </div>
);

// Register in config
const config = {
  preset: 'ts',
  tailwind: false,
  libraries: {
    '@myapp/ui': { Button, Input },
  }
};
```

Now AI can use both: `import { Button } from '@mui/material'` and `import { Input } from '@myapp/ui'`

## Examples

### Basic Usage
```tsx
<AIElementSlot>
  <AIElement prompt="Simple button with click handler" />
</AIElementSlot>
```

### With Props
```tsx
<AIElementSlot>
  <AIElement
    prompt="User profile card with avatar and stats"
    aiElementProps={{
      user: { name: 'John', avatar: '/avatar.jpg' },
      stats: { posts: 42, followers: 1250 }
    }}
  />
</AIElementSlot>
```

### With Custom Libraries
```tsx
// After registering Chart.js in config.libraries
<AIElementSlot>
  <AIElement
    prompt="Line chart showing sales data over time using Chart.js"
    aiElementProps={{
      data: [100, 120, 80, 150, 200],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    }}
  />
</AIElementSlot>
```

## Custom Error & Loading Components

```tsx
const CustomError = ({ error }: { error: string }) => (
  <div style={{ color: 'red', padding: '1rem' }}>
    Failed to generate: {error}
  </div>
);

const CustomLoading = () => (
  <div style={{ padding: '1rem' }}>
    Generating component, please wait...
  </div>
);

<AIElementSlot>
  <AIElement
    prompt="Complex component"
    ErrorComponent={CustomError}
    LoadingComponent={CustomLoading}
  />
</AIElementSlot>
```

## License

MIT © [ehabhosam](https://github.com/ehabhosam)
