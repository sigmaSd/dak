export async function engine(
  tasks: { [task: string]: (...args: string[]) => void | Promise<void> },
  options?: { defaultTask: string },
) {
  if (Deno.args.length === 0) {
    if (options?.defaultTask) {
      await tasks[options.defaultTask]();
    } else {
      console.log("No task specified");
    }
    return;
  }
  for (let i = 0; i < Deno.args.length; i++) {
    const task = Deno.args[i];
    // if task not in tasks throw error
    if (!tasks[task]) {
      console.error(`Task '${task}' not found`);
      return;
    }

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
