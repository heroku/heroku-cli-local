'use strict';

const child = require('child_process');
const cli = require('heroku-cli-util');
const co = require('co');
const https = require('https')
const url = require('url');
const tty = require('tty');
const path = require('path');
const fs = require('fs');
const stream = require('stream');

module.exports = function(topic, command) {
  return {
    topic: topic,
    command: command,
    description: 'Build an app locally',
    help: `Example:

    $ heroku local:build`,
    flags: [],
    needsApp: true,
    needsAuth: false,
    run: cli.command(co.wrap(run))
  }
};

function * run(context, heroku) {
  return new Promise((resolve, reject) => {
    cli.log(`Building ${context.app}`)
    let cmdArgs = ['run', '--rm', '-v', `${process.cwd()}:/workspace`, '-v', `${process.cwd()}/.heroku:/out`, 'packs/heroku-16:build']
    let spawned = child.spawn('docker', cmdArgs, {stdio: 'pipe'})
      .on('exit', (code, signal) => {
        if (signal || code) {
          reject(`There was a problem building the app.`);
        } else {
          resolve();
        }
      });
    spawned.stdout.on('data', (chunk) => {
      cli.console.writeLog(chunk.toString());
    });
    spawned.stderr.on('data', (chunk) => {
      cli.console.writeLog(chunk.toString());
    });
  });
}
