module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.
  
  // only for jest
  return isTest ? {
    presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
  } : {};
};