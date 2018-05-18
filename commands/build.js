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
    let containerName = `heroku-build-${Math.round(Math.random() * (9999 - 1000) + 1000)}`
    let cmdArgs = ['run', '--name', containerName, '--rm',
        '-v', `${process.cwd()}:/workspace`,
        '-v', `${process.cwd()}/.heroku/out:/out`,
        '-v', `${process.cwd()}/.heroku/cache:/cache`,
        'packs/heroku-16:build']
    let spawned = child.spawn('docker', cmdArgs, {stdio: 'pipe'})
      .on('exit', (code, signal) => {
        if (signal || code) {
          reject('There was a problem building the app.');
        } else {
          cli.log(`-----> Compressing...`) // not really, but it looks good
          let cmdArgs = ['cp', `${containerName}:/cache/cache.tgz`, `${process.cwd()}/.heroku/cache/cache.tgz`]
          let spawned = child.spawn('docker', cmdArgs, {stdio: 'pipe'})
            .on('exit', (code, signal) => {
              cli.log('       Done')
              resolve();
            });
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
