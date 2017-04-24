module.exports = config:

  conventions:
    assets: /^src\/assets/
    ignored: ['hooks', 'plugins', 'resources', 'www']

  paths:
    public: 'www'
    watched: ['src']

  files:
    javascripts:
      joinTo:
        'vendor.js': /^node_modules/,
        'main.js': /^src/
      order:
        after: [/\.html$/, /\.css$/]
    stylesheets:
      joinTo:
        'app.css': /(s?css)$/
    templates: joinTo: 'templates.js'

  plugins:
    inlineCss: {
      html: true
    },
    babel:
      presets: ['es2015','stage-0']
    brunchTypescript: {
      ignoreErrors: true
    },
    copycat: {
      "fonts" : ["node_modules/ionic-angular/fonts"],
      verbose : false,
      onlyChanged: true
    }

  hooks:
    preCompile: () ->
      console.log("Pre-compilation: generation de ionic.css...")
      sass = require('node-sass');
      fs = require('fs')
      if (!fs.existsSync('www'))
        fs.mkdirSync('www')
      return new Promise((res, rej) ->
        sass.render({
          data: '$font-path: "/fonts"; @import "ionic.build.default";',
          outFile: 'www/ionic.css',
          sourceMap: true,
          includePaths: [
            "node_modules/ionic-angular/themes",
            "node_modules/ionic-angular/fonts",
            "node_modules/ionicons/dist/scss"
          ]
        }, (err, result) ->
          if (err)
            return rej(err)
          require('fs').writeFileSync('www/ionic.css',     result.css.toString('utf8'))
          require('fs').writeFileSync('www/ionic.css.map', result.map.toString('utf8'))
          return res()
        );
      )

  overrides:
    production:
      sourceMaps: true

  server:
    hostname: '127.0.0.1'
