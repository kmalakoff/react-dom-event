import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  files: ['test/**/*.test.jsx'],
  plugins: [esbuildPlugin({ target: 'auto', ts: true, jsx: true, tsx: true,
    // optional JSX factory and fragment
    // jsxFactory: 'h',
    // jsxFragment: 'Fragment',
 }), importMapsPlugin({
  inject: {
    importMap: {
      imports: { react: 'https://esm.sh/stable/react@18.2.0/es2022/react.development.mjs', 'react-dom': 'https://esm.sh/stable/react-dom@18.2.0/es2022/react-dom.development.mjs', assert: 'https://esm.sh/assert' },
    },
  },
})],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '2000',
    },
  },
  // testRunnerHtml: () =>
  //   `<html>
  //   <body>
  //     <script type="module">
  //       import { mocha, sessionFinished, sessionFailed } from '@web/test-runner-mocha';
  
  //       try {
  //         // setup mocha
  //         mocha.setup({ ui: 'bdd' });
  
  //         // or import your test file
  //         await import('./test/unit/react-native.test.js');
  
  //         // run the tests, and notify the test runner after finishing
  //         mocha.run(() => {
  //           sessionFinished();
  //         });
  //       } catch (error) {
  //         console.error(error);
  //         // notify the test runner about errors
  //         sessionFailed(error);
  //       }
  //     </script>
  //   </body>
  // </html>`,
};