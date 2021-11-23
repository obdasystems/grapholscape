import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import license from 'rollup-plugin-license'
import path from 'path'
import json from '@rollup/plugin-json'

const VERSION = process.env.VERSION || 'snapshot' // default snapshot
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development' // default development
const dependencies = Object.keys(require('./package.json').dependencies)
dependencies.splice(dependencies.indexOf('lit'), 1)

const input = './src/index.js'
const name = 'Grapholscape'

const envVariables = {
  'process.env.VERSION': JSON.stringify(VERSION),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'preventAssignment': true,
}

const getJsonOptions = () => ({
  // include: 'src/**',
  // exclude: [ '**./**' ],

  // for tree-shaking, properties will be declared as
  // variables, using either `var` or `const`
  preferConst: true, // Default: false

  // specify indentation for the generated default export —
  // defaults to '\t'
  indent: '  ',

  // ignores indent and generates the smallest code
  compact: true, // Default: false
})

const getBabelOptions = () => ({
  include: [
    'src/**',
    'node_modules/lit/**',
    'node_modules/@material/**'
  ],
  babelrc: false,
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: "> 0.25%, not dead",
        useBuiltIns: 'usage',
        corejs: "3"
      }
    ]
  ]
})

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    content: {
      file: path.join(__dirname, 'LICENSE')
    }
  }
}

const configs = [
  { // development
    input,
    output: [
      {
        file: 'doc/static/demo/js/grapholscape.js',
        format: 'iife',
        name,
        sourcemap: 'inline'
      },
      {
        file: 'app/graphol/grapholscape.js',
        format: 'iife',
        name,
        sourcemap: 'inline'
      }
    ],
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
    ]
  },
  { // production transpiled, minified
    input,
    output: [
      {
        file: 'dist/grapholscape.min.js',
        format: 'iife',
        name,
        sourcemap: false
      },
      {
        file: 'dist/grapholscape.esm.min.js',
        format: 'es',
        sourcemap: false
      },
      {
        file: 'doc/static/demo/js/grapholscape.js',
        format: 'iife',
        name,
        sourcemap: false
      },
      {
        file: 'app/graphol/grapholscape.js',
        format: 'iife',
        name,
        sourcemap: false
      },
    ],
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      babel(getBabelOptions()),
      sizeSnapshot(),
      terser(),
      license(licenseHeaderOptions)
    ]
  },
  {
    input,
    output: {
      file: 'dist/grapholscape.esm.js',
      format: 'es',
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      license(licenseHeaderOptions)
    ],
    external: dependencies
  }
]

// splice(1) removes everything starting at index 1 and returns what he removed
export default NODE_ENV === 'production'
  ? configs.splice(1) : configs[0]
