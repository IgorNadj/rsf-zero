# rsf-zero

A minimal micro-framework for Node.js applications.

## Installation

```bash
npm install rsf-zero
# or
yarn add rsf-zero
```

### Automatic Installation
... TODO: implement a `npx create-rsf-zero`

### Manual Installation
After installing the package, add these scripts to your package.json:

```json
...
  "scripts": {
    "start": "rsf-zero start"
  },
...
```

Then create a public/index.html:
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

And finally create a src/main.tsx file:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    RSF Zero up and running!
  </StrictMode>,
);
```

## Usage

Run `npm start` or `yarn start` to start the server.

## Writing your app

### Client-side code

Any standard react will do!

### Server-side code (RSF)

Any file with a `'use server'` directive at the top of the file is an action, and will be executed on the server.

This file should have a single named export, which is your action you want to run on the server.

For example:
```typescript
// doSomethingOnServer.ts
'use server'

export const doSomethingOnServer = () => {
  ...
}
```

For a concrete example, see the [/example](/example) directory.

## Advanced Topics

### RSF/RSA spec differences

The RSF Zero framework implements a _subset_ of the full RSF spec.

|                                           | Full RSF Spec | RSF Zero                                              |
|-------------------------------------------|---------------|-------------------------------------------------------|
| `'use server'` at top of file             | ✅             | ✅                                                     |
| `'use server'` in a function block        | ✅             | Not allowed                                           |
| `'use server'` multiple times in one file | ✅             | Not allowed                                           |
| `'use client'`                            | ✅             | Does nothing, server-side rendering (SSR) is not used |

These "limitations" are an intentional design decision made to simplify the conceptual load on the developer, as well as to entirely eliminate all package compatibility issues with SSR.

### Action argument types

Action function calls are serialised and deserialised between client and server. Therefore, the types of arguments passed to actions must be serialisable.

RSF Zero uses [superjson](https://github.com/flightcontrolhq/superjson) under the hood, and most types are supported.
Most likely you will never run into issues with this, but it's worth noting.
