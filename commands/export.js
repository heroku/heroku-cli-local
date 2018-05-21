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
const os = require('os')

module.exports = function(topic, command) {
  return {
    topic: topic,
    command: command,
    description: 'Export a build to a Docker image',
    help: `Example:

    $ heroku local:export`,
    flags: [
      { name: 'tag', char: 't', hasValue: true, description: 'tag of the docker image' }],
    needsApp: true,
    needsAuth: false,
    run: cli.command(co.wrap(run))
  }
};

function * run(context, heroku) {
  return new Promise((resolve, reject) => {
    let cmdArgs = ['run', '--rm', '-v', `${process.cwd()}/.heroku/out:/workspace`,
        '-v', '/var/run/docker.sock:/var/run/docker.sock',
        'packs/heroku-16:export', context.app]
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
