// Example of configuring Rsf Zero with a config file

// See /docs/configuring.md for full documentation


/** @type { import('rsf-zero').RsfZeroConfig } */
export default {
    startStatic: {
        setHeaders: (res, path, stat) => {
            // Example: Set a custom X-Custom-Header
            res.set('X-Custom-Header', 'My-Static-File');
        }
    },
    routes: [
        './routes/health.ts'
    ],
    onStart: './onStart.ts',
}
