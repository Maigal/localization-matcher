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