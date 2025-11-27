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
- See [configuring](https://github.com/IgorNadj/rsf-zero/tree/main/docs/configuring.md)


You can also create a `vite-config.js` in the root of your project to configure Vite (used for dev mode only).

## Advanced topics

### Server function arguments

Server function calls are serialised and deserialised between client and server. Server function argument types must be serialisable.

**RSF Zero** uses [superjson](https://github.com/flightcontrolhq/superjson) under the hood, and the most common types are supported. 
See the [superjson docs](https://github.com/flightcontrolhq/superjson?tab=readme-ov-file#parse) for more info.

### Verbose logging
Prefix commands with `NODE_DEBUG=rsf-zero` to see debug logs, for example: `NODE_DEBUG=rsf-zero yarn build`.

### Note: server files are not built
This is more of an implementation detail, but starting with node 22.18, TypeScript support is enabled by default. 

Client files need to be built to .js files, as well as static assets, so these end up in /dist.

The action registry also ends up in /dist so as not to pollute the /src dir. 

Server files are run directly as ts files.
