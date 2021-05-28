const path = require('path');

module.exports = {
    mode:"production",
    entry:"./src/index.ts",
    target:"web",
    output:{
        library: "URlib",
        libraryTarget:"umd",
        filename: "urlib.min.js",
        globalObject: 'this'
    },
    module:{
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'babel-loader',
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    node:{
      console: true,
      process: true,
      Buffer: true
    }
}