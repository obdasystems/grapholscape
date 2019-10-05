import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import path from 'path'
import json from 'rollup-plugin-json'

const licenseHeaderOptions = {
  sourcemap: true,
  banner: {
    file: path.join(__dirname, 'LICENSE')
  }
}

export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
	input: ['./src/grapholscape.js'],
	output: {
		file: 'build/grapholscape.js',
    format: 'umd',
    name: 'grapholscape',
		sourcemap: true
	},
	plugins: [
    json({
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
    }),
    resolve(),
    commonjs({ include: '**/node_modules/**' }),
    babel({ exclude: '**/node_modules/**' }),
    license(licenseHeaderOptions)
  ]
};
