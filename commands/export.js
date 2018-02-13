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
    description: 'Export a build to a Docker image',
    help: `Example:

    $ heroku local:export`,
    args: [ {name: 'file'} ],
    flags: [
      { name: 'tag', char: 't', hasValue: true, description: 'tag of the docker image' }],
    needsApp: true,
    needsAuth: false,
    run: cli.command(co.wrap(run))
  }
};

function * run(context, heroku) {
  // TODO
  return new Promise(resolve => {})
}
