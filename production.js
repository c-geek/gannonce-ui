console.log("Post-compilation: to ES5...")
const babel = require('babel-core');
const options = {
  presets: ['es2015'],
  sourceMap: true
}

return new Promise((res, rej) => {
  babel.transformFile("www/main.js", options, (err, result) => {
    if (err) return rej(err)
    require('fs').writeFileSync('www/main.js',     result.code.toString('utf8'))
    require('fs').writeFileSync('www/main.js.map', result.map.toString('utf8'))
    return res()
  })
})
  .then(() => process.exit(0))
