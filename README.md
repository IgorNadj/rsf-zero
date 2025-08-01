# RSF Zero

A minimal micro-framework for RSF applications.

## Quick Start

**TODO**: implement an `npx @rsf-zero/create`

Or add it to an [existing project](rsf-zero/README.md).

Run `yarn dev` / `pnpm run dev` / `npm run dev`.

## Introduction to server functions
RSF ([React Server Functions](https://react.dev/reference/rsc/server-functions)) allow you to mark functions to run on the server:

```typescript
function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```
**Note**: ^ to be implemented... see below... but the best way to explain it... so keeping this as the example.

--

Server functions remove the need for separate server and client files (or different packages in your project).

|                               | RSF Zero             |
|-------------------------------|----------------------|
| `'use server'` at top of file | ✅                    |
| `'use server'` inline         | To be implemented... |

**RSF Zero** is a minimal implementation. It does what it needs to and nothing else 🕊️

## Writing your app

### Client-side code

Any standard react will do!

### Server-side code (RSF)

Any file with a `'use server'` directive at the top of the file marks it to run on the server, and all exported functions will be executed on the server.

For example:
```typescript
// doSomethingOnServer.ts
'use server'

export const doSomethingOnServer = async () => {
  ...
}
```

For a concrete example, see the [/example](/example) directory.

## Philosophy

### Minimal

Add whatever you want on top, nothing bundled that you don't use.

### Conceptually simple

Add `'use server'` to run something on the server, and you're done. Nothing new to learn.

Spend the spare time on a nice coffee or looking at a bird.
