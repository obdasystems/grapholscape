const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const replace = require('@rollup/plugin-replace')
const terser = require('@rollup/plugin-terser')
const license = require('rollup-plugin-license')
const path = require('path')
const typescript = require('@rollup/plugin-typescript')
const dts = require('rollup-plugin-dts').dts

const VERSION = process.env.VERSION || 'snapshot' // default snapshot
const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development' // default development

const dependencies = Object.keys(require('./package.json').dependencies)
dependencies.splice(dependencies.indexOf('lit'), 1)

const input = './src/index.ts'
const name = 'Grapholscape'

const envVariables = {
  'process.env.VERSION': JSON.stringify(VERSION),
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'preventAssignment': true,
}

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
        useBuiltIns: 'usage',
        corejs: "3"
      }
    ]
  ]
})

const typescriptOptions = {
  "allowSyntheticDefaultImports": true,
  "target": "ES6",
}

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
        file: 'demo/js/grapholscape.js',
        format: 'iife',
        name,
        sourcemap: 'inline',
        inlineDynamicImports: true,
      },
      {
        file: 'dist/grapholscape.esm.js',
        format: 'es',
        name,
        sourcemap: 'inline',
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript(typescriptOptions),
    ],
  },
  { // production transpiled, minified
    input,
    output: [
      {
        file: 'dist/grapholscape.min.js',
        format: 'iife',
        inlineDynamicImports: true,
        name,
        sourcemap: false
      },
      {
        file: 'dist/grapholscape.esm.min.js',
        format: 'es',
        inlineDynamicImports: true,
        sourcemap: false
      },
      {
        file: 'demo/js/grapholscape.js',
        format: 'iife',
        inlineDynamicImports: true,
        name,
        sourcemap: false
      },
    ],
    plugins: [
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript(typescriptOptions),
      babel(getBabelOptions()),
      terser(),
      license(licenseHeaderOptions)
    ]
  },
  {
    input,
    output: {
      file: 'dist/grapholscape.esm.js',
      inlineDynamicImports: true,
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript(typescriptOptions),
      license(licenseHeaderOptions)
    ],
    external: dependencies
  }
]

const typesRollup = {
  input: "temp/types/src/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()],
}

// splice(1) removes everything starting at index 1 and returns what he removed
module.exports = {
  default: NODE_ENV === 'production'
  ? [...configs.splice(1), typesRollup] : configs[0]
}
