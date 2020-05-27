#!/bin/bash
set -euxo pipefail
echo "Installing now"

yarn config set workspaces-experimental true
yarn config set workspaces-nohoist-experimental true
yarn install --non-interactive

