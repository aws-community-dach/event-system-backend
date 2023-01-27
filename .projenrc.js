const { awscdk } = require('projen');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: 'event-system-backend',
});

project.synth();