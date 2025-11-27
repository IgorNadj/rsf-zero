## Configuring

Create a file `.rsf0-config.js` at the root of your project.

E.g.

```javascript
/** @type { import('rsf-zero').RsfZeroConfig } */
export default {
    // Example: set custom headers
    startStatic: {
        setHeaders: (res, path, stat) => {
            // Example: Set a custom X-Custom-Header
            res.set('X-Custom-Header', 'My-Static-File');
        }
    },

    // Example: Load custom Express routes
    // File must have a single export that takes app, e.g.:
    // export const healthRoute = async (app: Express) => { ... }
    routes: [
        './routes/health.ts'
    ],

    // Example: do anything you like to the express app
    // File must have a single export that takes app, e.g.:
    // export const onStart = async (app: Express) => { ... }
    onStart: './onStart.ts',

    // Example: hook before anything is done to the express app
    // Useful for global error logging etc.
    onBeforeStart: './onBeforeStart.ts',
}
```

See also: [export-types.ts](https://github.com/IgorNadj/rsf-zero/tree/main/rsf-zero/src/utils/export-types.ts) for the shape of the RsfZeroConfig type.

