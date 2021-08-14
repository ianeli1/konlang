import { createReadStream } from "fs";
import path from "path";
import { createInterface } from "readline";
import { Kon } from "./interpreter";
import { parse } from "./parser";
import { inspect } from "util";

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
  const debugTree = args.includes("-t");
  if (filename) {
    const file = loadFile(path.join(process.cwd(), filename));
    if (!file) {
      throw new Error(`File ${filename} doesn't exist`);
    }
    let lineNumber = 0;
    file.on("line", (line) => {
      lineNumber++;
      try {
        parse(line).forEach((x) => {
          debugTree &&
            console.log(
              `Raw: ${line}\n${inspect(x, {
                showHidden: false,
                depth: null,
                colors: true,
              })}\n`
            );
          kon.evaluateOne(x);
        });
      } catch (e) {
        throw new Error(`[konlang line=${lineNumber}] => ${e.message}`);
      }
    });
  } else {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let lineNumber = 0;
    const arrow = "\x1b[36m~>\x1b[0m ";
    rl.write(arrow);
    rl.on("line", (line) => {
      lineNumber++;
      line = line.slice(arrow.length);

      try {
        const parsed = parse(line.replace("$", ""));
        if (line[0] === "$") {
          console.log(`Tree: ${JSON.stringify(parsed, null, 2)}\n`);
        }
        line === "exit"
          ? rl.close()
          : parsed.forEach((x) =>
              console.log(`\x1b[32m<\x1b[0m ${kon.evaluateOne(x)}`)
            ); //kon.executeLine(line, ++lineNumber)
      } catch (e) {
        console.log(
          `\x1b[31m[konSole line=${lineNumber} error] => ${e.message}`
        );
      }
      rl.write(arrow);
    });
  }
}

main();
