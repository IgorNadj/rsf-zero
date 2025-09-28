# rsf-zero

## Setup

Add these scripts to your **package.json**:

```
...
  "scripts": {
    "dev": "rsf-zero dev",
    "build": "rsf-zero build",
    "start": "rsf-zero start",
  },
...
```

Then create an **index.html**:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RSF-Zero example</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

And finally create a **src/main.tsx** file:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    RSF Zero up and running!
  </StrictMode>,
);
```

### Configuring

You can create a `rsf0-config.js` file in the root of your project to configure RSF Zero.

You can also create a `vite-config.js` in the root of your project to configure Vite (used for dev mode only).

See the example for reference.

## Advanced topics

### Server function arguments

Server function calls are serialised and deserialised between client and server. Server function argument types must be serialisable.

**RSF Zero** uses [superjson](https://github.com/flightcontrolhq/superjson) under the hood, and the most common types are supported. 
See the [superjson docs](https://github.com/flightcontrolhq/superjson?tab=readme-ov-file#parse) for more info.

### Verbose logging
Prefix commands with `NODE_DEBUG=rsf-zero` to see debug logs, for example: `NODE_DEBUG=rsf-zero yarn build`.
