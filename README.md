# RSF Zero

A minimal micro-framework with React Server Functions support.

## Installation

```bash
yarn add rsf-zero
# or
pnpm add rsf-zero
# or
npm install rsf-zero
```

Then follow [setup](https://github.com/IgorNadj/rsf-zero/tree/main/docs/setup.md#Setup).

## Quick intro to Server Functions
React Server Functions allow you to mark functions to run on the server:

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

### More examples
See [/example/src/App.tsx](https://github.com/IgorNadj/rsf-zero/tree/main/example/src/App.tsx).

### Reference Docs
- [React Server Functions](https://react.dev/reference/rsc/server-functions)
- Note: only the top-level `'use server'` is implemented by this framework.

## Motivation

**RSF Zero** is designed to be a dead simple micro-framework.

Read the [blog post](https://igornadj.io/blog/2025-08-02-rsf-is-all-you-need/) for the motivation behind it.

🕊 **Minimal**: Add whatever you want on top, nothing bundled that you don't use\
🕊 **Simple**: Add `'use server'` to run something on the server, and you're done, nothing new to learn\
🕊️ **Done**: Instead, spend your spare time sipping a nice coffee or looking at a bird
