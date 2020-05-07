import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import license from 'rollup-plugin-license'
import path from 'path'
import json from 'rollup-plugin-json'

const VERSION = process.env.VERSION || 'snapshot' // default snapshot
const FILE = process.env.FILE
const SOURCEMAPS = process.env.SOURCEMAPS === 'false' // default true
const BABEL = process.env.BABEL !== 'false' // default true
const NODE_ENV = process.env.NODE_ENV === 'development' ? 'production' : 'development' // default development
const matchSnapshot = process.env.SNAPSHOT === 'match'
const dependencies = Object.keys(require('./package.json').dependencies)
dependencies.splice(dependencies.indexOf('lit-html'), 1 );
dependencies.splice(dependencies.indexOf('lit-element'), 1 );

const input = './src/grapholscape.js'
const name = 'GrapholScape'

const envVariables = {
  'process.env.VERSION': JSON.stringify(VERSION),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}

const getJsonOptions = () => ({
  //include: 'src/**',
  //exclude: [ '**./**' ],

  // for tree-shaking, properties will be declared as
  // variables, using either `var` or `const`
  preferConst: true, // Default: false

  // specify indentation for the generated default export —
  // defaults to '\t'
  indent: '  ',

  // ignores indent and generates the smallest code
  compact: true, // Default: false

  // generate a named export for every property of the JSON object
  namedExports: true // Default: true
})

const getBabelOptions = () => ({
  include: [
    'src/**',
    'node_modules/lit-html/**',
    'node_modules/lit-element/**',
    'node_modules/@material/**'
  ],
  babelrc: false,
  externalHelpers: true,
  presets : [
    [
      "@babel/preset-env",
      {
        useBuiltIns : "usage",
        corejs: 3
      }
    ]
  ]
})

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    content: {
      file : path.join(__dirname, 'LICENSE')
    }
  }
}

const configs = [
  {
    input,
    output: {
      file: 'build/grapholscape.js',
      format: 'umd',
      name,
      sourcemap: SOURCEMAPS ? 'inline' : false
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      BABEL ? babel(getBabelOptions()) : {},
      replace(envVariables),
      license(licenseHeaderOptions),
      !FILE ? sizeSnapshot({ matchSnapshot }) : {}
    ]
  },

  {
    input,
    output: {
      file: 'build/grapholscape.min.js',
      format: 'umd',
      name
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      BABEL ? babel(getBabelOptions()) : {},
      replace(envVariables),
      terser({
        sourcemap: false
      }),
      license(licenseHeaderOptions)
    ]
  },

  {
    input,
    output: {
      file: 'build/grapholscape.umd.js',
      format: 'umd',
      name,
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      BABEL ? babel(getBabelOptions()) : {},
      replace(envVariables),
      license(licenseHeaderOptions)
    ],
    external: dependencies
  },
  {
    input,
    output: {
      file: 'build/grapholscape.esm.js',
      format: 'es',
      name,
    },
    plugins: [
      json(getJsonOptions()),
      nodeResolve(),
      commonjs({ include: '**/node_modules/**' }),
      BABEL ? babel(getBabelOptions()) : {},
      replace(envVariables),
      license(licenseHeaderOptions)
    ],
    external: dependencies
  }
]

export default FILE
  ? configs.filter(config => config.output.file.endsWith(FILE + '.js'))
  : configs
