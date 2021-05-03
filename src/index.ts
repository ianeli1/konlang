import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { Kon } from "./interpreter";

function loadFile(path: string) {
  try {
    return createInterface({
      input: createReadStream(path),
    });
  } catch (e) {
    console.trace(e);
    return undefined;
  }
}

function main() {
  const [, , filename, ...args] = process.argv;
  const kon = new Kon();
  args;
  if (filename) {
    const file = loadFile(path.join(process.cwd(), filename));
    if (!file) {
      throw new Error(`File ${filename} doesn't exist`);
    }
    let lineNumber = 0;
    file.on("line", (line) => kon.executeLine(line, ++lineNumber));
  } else {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let lineNumber = 0;
    rl.on("line", (line) =>
      line === "exit" ? rl.close() : kon.executeLine(line, ++lineNumber)
    );
  }
}

main();
