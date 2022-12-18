require('esbuild').buildSync({
    entryPoints: ['./src/crypto-ts.ts'],
    outfile: './dist/avm/crypto.min.js',
    format: 'esm',
    bundle: true,
    minify: true,
    platform: 'node',
    external: []
})
