module.exports = {
  presets: [
    ['@babel/preset-env', { targets: '>0.2%, not dead, not op_mini all' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    ['@babel/preset-typescript'],
  ],
  env: {
    development: {
      plugins: ['react-refresh/babel'],
    },
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        ['@babel/preset-typescript'],
      ],
    },
  },
};
