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
const SOURCEMAPS = process.env.SOURCEMAPS === 'true' // default false
const BABEL = process.env.BABEL !== 'false' // default true
const NODE_ENV = process.env.NODE_ENV === 'development' ? 'development' : 'production' // default prod
const matchSnapshot = process.env.SNAPSHOT === 'match'

const input = './src/grapholscape.js'
const name = 'grapholscape'

const envVariables = {
  'process.env.VERSION': JSON.stringify(VERSION),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}

const getJsonOptions = () => ({
  include: 'src/**',
  exclude: [ '**./**' ],

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
  exclude: '**/node_modules/**',
  include: '/node_modules(?:\/|\\)lit-element|lit-html/',
  externalHelpers: true,
  presets : [
    ["@babel/env", { useBuiltIns: "usage" }]
  ]
})

// Ignore all node_modules dependencies
const isExternal = id => !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/')

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    file: path.join(__dirname, 'LICENSE')
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
  }
]

export default FILE
  ? configs.filter(config => config.output.file.includes(FILE))
  : configs
