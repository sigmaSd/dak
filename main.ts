import { engine } from "./src/dak.ts";

const tasks = {
  record(url: string) {
    console.log(`Recording ${url}`);
  },
  add(a: string, b: string) {
    const res = parseInt(a) + parseInt(b);
    console.log(`${a} + ${b} = ${res}`);
  },
  async sing(song: string) {
    console.log(`Singing ${song}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Done singing ${song}`);
  },
  help() {
    console.log(`
    record <url>
    add <a> <b>
    sing <song>
    help
    `);
  },
  "-h": () => tasks.help(),
};

await engine(tasks);
