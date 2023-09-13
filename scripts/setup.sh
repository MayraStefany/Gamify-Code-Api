#!/bin/bash
cd ~/gamify-api
npm i -f
npx pm2 startOrRestart ecosystem.config.js
npx pm2 save
