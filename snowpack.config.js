/** @type {import("snowpack").SnowpackUserConfig } */
// const plugins = [
//   // ...
//   [
//     "snowpack-plugin-rollup-bundle",
//     {
//       emitHtmlFiles: false,
//       preserveSourceFiles: false,

//       // equivalent to inputOptions.input from Rollup
//       entrypoints: string | string[] | { [entryName: string]: string },

// extendConfig: (config) => {
//   // https://rollupjs.org/guide/en/#outputoptions-object
//   config.outputOptions = {}

//   // https://rollupjs.org/guide/en/#inputoptions-object
//   config.inputOptions = {}

//   return config
// }
//     }
//   ]
// ]
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: {url: '/dist'},
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
