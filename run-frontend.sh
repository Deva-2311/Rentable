#!/bin/bash
# Remove npm injected prefix to avoid nvm conflicts
unset npm_config_prefix

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Switch to LTS Node
nvm use --lts

# Run the frontend dev server
npm --prefix frontend run dev
