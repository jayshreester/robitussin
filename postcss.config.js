
    plugins: (loader) => [
      require('autoprefixer')({
        browsers: [
          'last 2 versions',
          '> 1%',
        ], // browser options can be configured from https://github.com/browserslist/browserslist
      }),
    ]