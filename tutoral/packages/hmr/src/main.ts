import { render } from './render';
import { initState } from './state';

render();
initState();

/* 指定某个子模块的HMR */
// if (import.meta.hot) { 
//   import.meta.hot.accept('./render.ts', (newModule) => { 
//     newModule.render();
//   });
// }

/* 指定多个子模块的HMR */
if (import.meta.hot) { 
  import.meta.hot.accept(['./render.ts','./state.ts'], (modules) => { 
    const [renderModule, stateModule] = modules;
    console.log(modules)

    if (renderModule) { 
      renderModule.render();
    }

    if (stateModule) { 
      stateModule.initState();
    }
  });
}