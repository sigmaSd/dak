import { $$ } from "https://deno.land/x/simple_shell@0.3.0/mod.ts";
import { engine } from "../src/dak.ts";

const MAKE = "make";

const PUBLIC_DIR = "public";
const OUT_DIR = "build";
const BUNDLED = `${OUT_DIR}/bundle.js`;
const MINIFIED = `${OUT_DIR}/bundle.min.js`;

const IGNORE = `--ignore=${PUBLIC_DIR},${OUT_DIR},docs,README.md`;
const CONFIG = "--config tsconfig.json";

const tasks = {
  all() {
    tasks.hooks();
    tasks.install();
    tasks["fmt-check"]();
    tasks.lint();
    tasks.build();
  },
  help() {
    console.log("Available tasks:");
    console.log(
      Object.keys(tasks)
        .map((e) => `- ${e}`)
        .join("\n"),
    );
  },
  "-h": () => tasks.help(),
  hooks() {
    $$`cd .git/hooks && ln -s -f ../../hooks/pre-push pre-push`;
  },
  install() {
    $$`deno cache deps.ts`;
    $$`deno cache dev_deps.ts`;
  },
  upgrade() {
    $$`deno cache --reload deps.ts`;
    $$`deno cache --reload dev_deps.ts`;
  },
  fmt() {
    $$`deno fmt ${IGNORE} --unstable`;
  },
  "fmt-check"() {
    $$`deno fmt --check ${IGNORE} --unstable`;
  },
  lint() {
    $$`deno lint --unstable ${IGNORE}`;
  },
  l: () => tasks.lint(),
  clean() {
    $$`rm -rf ${OUT_DIR}`;
  },
  assets() {
    $$`mkdir -p ${OUT_DIR}`;
    $$`cp ${PUBLIC_DIR}/styles.css ${OUT_DIR}`;
  },
  "bundle-dev"() {
    $$`cp ${PUBLIC_DIR}/dev.html ${OUT_DIR}/index.html`;
    $$`deno bundle --watch ${CONFIG} src/index.jsx ${BUNDLED}`;
  },
  "bundle-prod"() {
    $$`cp ${PUBLIC_DIR}/prod.html ${OUT_DIR}/index.html`;
    $$`deno bundle ${CONFIG} src/index.jsx ${BUNDLED}`;
  },
  "static-server"() {
    $$`deno run ${CONFIG} --allow-net --allow-read static.ts`;
  },
  serve() {
    $$`${MAKE} -j 2 bundle-dev static-server`;
  },
  s: () => tasks.serve(),
  minify() {
    $$`npx esbuild ${BUNDLED} \
		--outfile=${MINIFIED} \
		--minify \
		--sourcemap \
		--define:'process.env.NODE_ENV="production"'`;
  },
  build() {
    tasks["bundle-prod"]();
    tasks.minify();
  },
};

engine(tasks, { defaultTask: "help" });
