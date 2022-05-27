import { engine } from "./src/dak.ts";

const tasks = {
  record(url: string) {
    console.log(`Recording ${url}`);
  },
  add(a: string, b: string) {
    const res = parseInt(a) + parseInt(b);
    console.log(`${a} + ${b} = ${res}`);
  },
};
engine(tasks);
