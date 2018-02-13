'use strict';
exports.topic = {
  name: 'local',
  description: 'Build and run a Heroku app locally'
};

exports.commands = [
  require('./commands/build.js')('local', 'build'),
  require('./commands/run.js')('local', 'run'),
  require('./commands/export.js')('local', 'export')
];
