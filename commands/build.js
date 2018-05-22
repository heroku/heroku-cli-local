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
    let bin = path.join(__dirname, `heroku-local-${os.platform()}`)
    if (!fs.existsSync(bin)) {
      reject(`Unsupported platform: ${os.platform()}`);
    }
    let cmdArgs = ['build', process.cwd(), context.app, '--skip-stack-pull']
    let spawned = child.spawn(bin, cmdArgs, {stdio: 'pipe'})
    spawned.stdout.on('data', (chunk) => {
      cli.console.writeLog(chunk.toString());
    });
    spawned.stderr.on('data', (chunk) => {
      cli.console.writeLog(chunk.toString());
    });
  });
}
