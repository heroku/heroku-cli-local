'use strict';

const child = require('child_process');
const cli = require('heroku-cli-util');
const exec = require('heroku-exec-util');
const co = require('co');
const Client = require('ssh2').Client;
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
    args: [ {name: 'file'} ],
    flags: [
      { name: 'buildpack', char: 'b', hasValue: true, description: 'the buildpack to use' }],
    needsApp: true,
    needsAuth: false,
    run: cli.command(co.wrap(run))
  }
};

function * run(context, heroku) {
  cli.log(`Building...`)
  build(context, args)
  return new Promise(resolve => {})
}

function build(context, args) {
  return new Promise((resolve, reject) => {
    cli.hush(`cf local stage ${context.app}`)
    let cmdArgs = ['local', 'stage', context.app]
    let spawned = child.spawn('cf', cmdArgs, {stdio: 'pipe'})
      .on('exit', (code, signal) => {
        if (signal || code) {
          reject(
            `There was a problem building the app.
            Make sure you have permission to deploy by running: ${cli.color.magenta('heroku apps:info -a ' + context.app)}`);
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
