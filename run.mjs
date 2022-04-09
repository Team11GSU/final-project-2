#!/usr/bin/env node

import { $, argv } from 'zx';

/**
 * Script used to run both the flask server and the Parcel bundler in parallel
 * or clear js folder and build and run if in production mode
 * use --prod for production mode
 */

// await $`npm ci`
if (argv.prod) {
  process.env.FLASK_APP = 'app:app';
  await $`npx parcel build`;
  //   await $`gunicorn app:app`;
  await $`flask run`;
} else {
  process.env.FORCE_COLOR = '1';
  process.env.FLASK_APP = 'app:app';
  process.env.FLASK_ENV = 'development';
  await Promise.all([
    $`npx parcel watch --dist-dir ./static/js`,
    $`python3 app.py`,
  ]);
}
