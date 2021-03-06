const path = require('path');

// transform expects a path, not an object, so we have to define
// our babel config in a separate file rather than inline
module.exports = {
  transform: {
    '^.+\\.js$': path.resolve(__dirname, './jest.babel.js'),
  },
};
