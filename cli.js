#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

let configPath;
let config;
let outputHTML = false;

program
  .version('1.0.0')
  .arguments('<configPath>')
  .action(function (cPath) {
    configPath = cPath;
  })
  .option('--export', 'Export output to HTML file')

program.parse(process.argv);

if (program.export) {
  outputHTML = true;
}

if (configPath) {
  init()
} else {
  inquirer
  .prompt([
    {
      name: 'configPath',
      message: 'What\'s the path of the config file?',
    },
  ])
  .then(answers => {
    configPath = answers.configPath;
    init()
  });
}

function init() {
  fs.readFile(configPath, 'utf8', (err, data) => {  
    if (data) {
      config = JSON.parse(data)
      console.log(chalk.greenBright('Successfully loaded config'))
    } else {
      console.log(chalk.redBright('Invalid config file. Please try again with the correct path'))
    }
  })
}


function recursiveIteration(object, parent, target, fl) {
  for (var property in object) {
      if (object.hasOwnProperty(property)) {
          if (typeof object[property] == "object"){
              var parents = (parent ? parent : '') + (property? property : '')
              recursiveIteration(object[property], parents + '.', target, fl);
          }else{
              if(!getO(target, parent+property)) { 
                console.log("\x1b[41m", fl + ' \x1b[0m -> ' + parent + '\x1b[1m' + property, '\x1b[0m')
              }
          }
      }
  }
}

function getO(object, key) {
  var keys = key.split('.');
  for (var i = 0; i < keys.length; i++) {
      if (!object.hasOwnProperty(keys[i])) {
          return null;
      }
      object = object[keys[i]];
  }
  return object;
}
