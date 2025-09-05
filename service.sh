#!/bin/bash

# Start shefu app
cd apps/shefu || exit
yarn run dev &   # run in background

# Go back to root
cd ../..

# Start ws app
cd apps/ws || exit
yarn run dev
