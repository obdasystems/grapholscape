import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import path from 'path'

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
    resolve(),
    commonjs({ include: '**/node_modules/**' }),
    babel({ exclude: '**/node_modules/**' }),
    license(licenseHeaderOptions)
  ]
};
