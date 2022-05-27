// deno-lint-ignore no-explicit-any
export async function engine(tasks: any) {
  for (let i = 0; i < Deno.args.length; i++) {
    const task = Deno.args[i];
    const taskFn = tasks[task];
    const argsNum = taskFn.length;
    const args = Deno.args.slice(i + 1, i + argsNum + 1);
    if (args.length !== argsNum) {
      console.error(`${task} requires ${argsNum} arguments`);
      Deno.exit(1);
    }
    await taskFn(...args);
    i += argsNum;
  }
}
