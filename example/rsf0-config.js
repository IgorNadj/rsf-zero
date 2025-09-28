// Example of configuring Rsf Zero with a config file

export const config = {
    startStatic: {
        setHeaders: (res, path, stat) => {
            // Example: Set a custom X-Custom-Header
            res.set('X-Custom-Header', 'My-Static-File');
        }
    }
}
