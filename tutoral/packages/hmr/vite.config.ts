import { defineConfig, UserConfig } from 'vite'

export default defineConfig((): UserConfig => {
  const root = process.cwd();
  return {root}
})