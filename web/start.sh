#!/bin/bash

# Step 2: Run a static file server (only if PRODUCTION=true)
if [ "$PRODUCTION" = "true" ]; then
    # Step 1: Build the Angular app
    ng build --configuration production
    npx http-server ./dist/your-app-name -p 80 -a 0.0.0.0
else
    sleep infinity
fi
