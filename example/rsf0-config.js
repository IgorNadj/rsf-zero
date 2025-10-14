// Example of configuring Rsf Zero with a config file

/** @type { import('rsf-zero').RsfZeroConfig } */
export default {
    startStatic: {
        setHeaders: (res, path, stat) => {
            // Example: Set a custom X-Custom-Header
            res.set('X-Custom-Header', 'My-Static-File');
        }
    },
    routes: [
        // Example: Load custom Express routes
        './routes/health.ts'
    ]
}
