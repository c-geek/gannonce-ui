# gannonce-ui

## Installation

    yarn
    
## Website production

### For development

    ./node_modules/brunch/bin/brunch watch --server
    
Now you can modify any source and have the website reloaded in your browser.

### For production

    ./node_modules/brunch/bin/brunch build --production
    
The website will be located in the `www/` folder, minified and all. For production usage.

## Configuration

You might need to change few URL calls, just replace `localhost:8600` by the URL you want in the 2 or 3 files where such URLs exist.
