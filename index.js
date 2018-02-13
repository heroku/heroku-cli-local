'use strict';
exports.topic = {
  name: 'ps',
  description: 'Client tools for Heroku Exec'
};

exports.commands = [
  require('./commands/ssh.js')('local', 'build'),
  require('./commands/socks.js')('local', 'run'),
  require('./commands/port.js')('local', 'export')
];
