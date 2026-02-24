import { rolldown } from "rolldown";
import path from "path";
import fs from "fs-extra";
const { readFile, writeFile, ensureDir, copy, pathExists } = fs;
import pc from "picocolors";
const { green, cyan, dim } = pc;

export interface BuildOptions {
  root?: string;
  outDir?: string;
  base?: string;
}

export async function build(options: BuildOptions = {}) {
  const root = options.root || process.cwd();
  const outDir = options.outDir || "dist";
  const base = options.base || "/";
  const outPath = path.resolve(root, outDir);

  console.log(cyan("\nBuilding for production...\n"));

  // 清理输出目录
  await ensureDir(outPath);
  await fs.emptyDir(outPath);

  // 入口文件
  const entry = path.resolve(root, "src/main.tsx");

  // 收集 CSS
  const cssChunks: string[] = [];

  // 使用 rolldown 构建
  const bundle = await rolldown({
    input: entry,
    plugins: [
      // 处理 CSS
      {
        name: "build:css",
        async load(id) {
          if (id.endsWith(".css")) {
            const code = await readFile(id, "utf-8");
            cssChunks.push(code);
            return { code: "" };
          }
          return null;
        },
      },
      // 处理 SVG 等静态资源
      {
        name: "build:assets",
        async load(id) {
          if (id.endsWith(".svg")) {
            const relativePath = path.relative(root, id);
            const fileName = path.basename(id);
            const assetsDir = path.join(outPath, "assets");
            await ensureDir(assetsDir);
            await copy(id, path.join(assetsDir, fileName));
            return {
              code: `export default "${base}assets/${fileName}"`,
            };
          }
          return null;
        },
      },
    ],
  });

  const { output } = await bundle.write({
    dir: outPath,
    format: "esm",
    entryFileNames: "assets/[name]-[hash].js",
    chunkFileNames: "assets/[name]-[hash].js",
  });

  await bundle.close();

  // 找到入口 chunk
  const entryChunk = output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  if (!entryChunk || entryChunk.type !== "chunk") {
    throw new Error("No entry chunk found");
  }

  // 写入合并后的 CSS
  let cssFileName = "";
  if (cssChunks.length > 0) {
    const cssContent = cssChunks.join("\n");
    const cssHash = simpleHash(cssContent);
    cssFileName = `assets/index-${cssHash}.css`;
    await writeFile(path.join(outPath, cssFileName), cssContent);
  }

  // 处理 index.html
  const htmlPath = path.resolve(root, "index.html");
  let html = await readFile(htmlPath, "utf-8");

  // 移除开发时的 script 标签，注入生产版本
  html = html.replace(
    /<script type="module" src="[^"]*"><\/script>/,
    ""
  );

  // 注入 CSS 和 JS
  const cssTag = cssFileName
    ? `<link rel="stylesheet" href="${base}${cssFileName}">`
    : "";
  const jsTag = `<script type="module" src="${base}${entryChunk.fileName}"></script>`;

  html = html.replace("</head>", `  ${cssTag}\n</head>`);
  html = html.replace("</body>", `  ${jsTag}\n</body>`);

  await writeFile(path.join(outPath, "index.html"), html);

  // 复制 public 目录
  const publicDir = path.resolve(root, "public");
  if (await pathExists(publicDir)) {
    await copy(publicDir, outPath);
  }

  // 输出构建信息
  console.log(green("✓") + " Build completed.\n");
  console.log(dim(outDir + "/"));

  const files = await getAllFiles(outPath);
  for (const file of files) {
    const relativePath = path.relative(outPath, file);
    const stat = await fs.stat(file);
    const size = formatSize(stat.size);
    console.log(`  ${relativePath.padEnd(40)} ${dim(size)}`);
  }

  console.log();
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).slice(0, 8);
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " kB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
