const fs = require('fs')
const validator = require('validator')
// parse commands
const yargs = require('yargs')

// fs.writeFileSync('notes.txt', 'This file was created!');
// fs.appendFileSync('notes.txt', 'test')

// commands
// console.log(process.argv);
// const command = process.argv[2];
// if (command === 'add') {
//   console.log('Adding note!')
// }

// yargs
// node ./module-system/app.js --help
// provide description for add command
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler: function (argv) {
    console.log('Adding a new note ' + argv.title)
  },
})

yargs.command({
  command: 'remove',
  describe: 'Remove a new note',
  handler: function () {
    console.log('Removing a new note')
  }
})

console.log(yargs.argv)
// console.log(yargs.argv.title)
// console.log(yargs.argv.arg)
