const path = require('path');
const fs = require('fs');
const solc = require('solc');

/* reading sol file rather than importing it because in import statement node
  expect a .js file but our file is .sol*/
const inboxPath = path.resolve(__dirname, 'contracts', 'LineOfCredit.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':LineOfCredit'];
