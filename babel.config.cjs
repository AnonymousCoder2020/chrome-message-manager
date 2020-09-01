module.exports = {
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
  plugins: [
    'babel-plugin-styled-components',
    [
      'transform-imports',
      {
        lodash: {
          transform: 'lodash/${member}',
        },
        'next-ts-utility': {
          transform: 'next-ts-utility/dist/${member}',
        },
      },
    ],
  ],
}
