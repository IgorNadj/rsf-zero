# RSF Zero

A minimal micro-framework for RSF applications.

## Quick Start

`npx @rsf-zero/create`

Then run `yarn dev` | `pnpm run dev` | `npm run dev`


Or, add it to an [existing project](rsf-zero/README.md).

## Demo

TODO

## Introduction to server functions
RSF ([React Server Functions](https://react.dev/reference/rsc/server-functions)) allow you to mark functions to run on the server:

```tsx
function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

Note: **Server Functions** are a separate concept from [Server Components](https://react.dev/reference/rsc/server-components) (RSC).
Server Components are components which are rendered on the server and passed to the client.
Server Functions can be used inside Server Components, but this is not a requirement.

Server Functions can be called by client components directly, which is what **RSF-Zero** supports.

**RSF Zero** is a minimal implementation. It does what it needs to and nothing else 🕊️

### Top-level 'use server'

Any file with a `'use server'` directive at the top of the file marks it to be run on the server. 
Any exported function is a server function which will run on the server.

```tsx
'use server'

// Server function
export const addComment = async (comment: Comment) => {
  await db.comment.create(comment);
}
```

```tsx
import { addComment } from './addComment.ts';

export const AddCommentButton = (comment: Comment) => 
  <Button onClick={() => addComment(comment)} />
```

### Inline 'use server'

TODO



## Philosophy

### Minimal

Add whatever you want on top, nothing bundled that you don't use.

### Conceptually simple

Add `'use server'` to run something on the server, and you're done. Nothing new to learn.

Spend the spare time on a nice coffee or looking at a bird.
