# RSF Zero

A minimal micro-framework with React Server Functions support.

## Quick Start

TODO `npm create rsf-zero@latest`

Or, add it to an [existing project](rsf-zero/README.md).

## Quick intro to Server Functions
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

### Top-level 'use server'

Any exported function in a file which starts with `'use server'` is a Server Function which will run on the server.

```tsx
'use server';

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

### More examples
See [/example/src/App.tsx](example/src/App.tsx).

### What about Server Components?

[Server Components](https://react.dev/reference/rsc/server-components) (RSC) are components which are rendered on the server (server side rendering or SSR) and passed to the client.
They can be useful for a faster initial page load. 

As great as SSR is, it comes with drawbacks. Whether you need it or not is a question of tradeoffs.

## Philosophy

**RSF Zero** is designed to be a dead simple micro-framework.

🕊 **Minimal**: Add whatever you want on top, nothing bundled that you don't use\
🕊 **Simple**: Add `'use server'` to run something on the server, and you're done, nothing new to learn\
🕊️ **Done**: Instead, spend your spare time sipping a nice coffee or looking at a bird
