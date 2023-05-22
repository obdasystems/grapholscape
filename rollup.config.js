import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import license from 'rollup-plugin-license'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

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
    output: {
      file: 'demo/js/grapholscape.js',
      format: 'iife',
      name,
      sourcemap: 'inline'
    },
    plugins: [
      nodeResolve(),
      replace(envVariables),
      commonjs({ include: '**/node_modules/**' }),
      typescript(typescriptOptions),
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
        file: 'demo/js/grapholscape.js',
        format: 'iife',
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
export default NODE_ENV === 'production'
  ? [...configs.splice(1), typesRollup ] : configs[0]
