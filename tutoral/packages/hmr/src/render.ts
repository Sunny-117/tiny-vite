export const render = () => {

  /**
   * import.meta.hot对象只有在开发阶段才会被注入到全局，生产环境是访问不到的
   * 生产环境会自动的把这部分的代码做tree-shaking，来优化资源体积
   */
  // if (import.meta.hot) { 
  //   import.meta.hot.accept((newModule) => { 
  //     console.log("🚀 ~ newModule:", newModule)
  //     newModule.render();
  //   });
  // }

  const app = document.querySelector<HTMLDivElement>('#app');
  app.innerHTML = `
    <h1>Hello, Vite HMR!!!</h1>
  `;
}