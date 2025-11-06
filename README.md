# react-ai-element

Runtime AI-generated React components from prompts.

```tsx
import { AIElement } from 'react-ai-element';

<AIElement
  prompt="modern employee card with avatar and role badge"
  props={{ name: 'Ahmad', role: 'Engineer' }}
/>
```

# Install
```bash
npm install react-ai-element
```

# Usage

1. Create a config file
```ts
// ai-element.config.ts
export const { AIElement } = createAIElement({
  keys: { 'openai': 'sk-...' },
});
```

2. Use in your app
```ts
import { AIElement } from './ai-element.config';

function App() {
  return (
    <AIElement
      prompt="dashboard stats card with big number and trend arrow"
      props={{ value: 42_150, change: +12.5 }}
    />
  );
}
```

## Config Options
```ts
{
  keys: { openai?: string; gemini?: string; ... };
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

License
MIT
