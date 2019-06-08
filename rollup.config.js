import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  // If using any exports from a symlinked project, uncomment the following:
  // preserveSymlinks: true,
	input: ['./source/grapholscape.js'],
	output: {
		file: 'build/grapholscape.js',
    format: 'umd',
    name: 'grapholscape',
		sourcemap: true
	},
	plugins: [
    resolve(),
    commonjs({ include: '**/node_modules/**' })
  ]
};
