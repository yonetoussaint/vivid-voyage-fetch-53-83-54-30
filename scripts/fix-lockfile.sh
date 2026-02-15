#!/bin/bash
cd /vercel/share/v0-project
rm -f pnpm-lock.yaml
rm -f package-lock.json
npm install --package-lock-only
