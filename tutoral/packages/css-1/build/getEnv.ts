type Recordable<T = any> = Record<string, T>;

export function wrapperEnv(envConfig: Recordable):ViteEnv { 
  const ret: any = {};
  for (const envName of Object.keys(envConfig)) { 
    let realName = envConfig[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    if (envName === 'VITE_PORT') { 
      realName = Number(realName);
    }
    ret[envName] = realName;
  }
  return ret;
}