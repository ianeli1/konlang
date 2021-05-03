import { konError } from "./error";
import { Kon } from "./interpreter";
import { assignRegex, commentRegex, execRegex, letRegex } from "./regex";
import { report } from "./utils";

/**
 * is in charge of determining if instruction is declaration, re
 * @param memory
 */
export function executeLine(this: Kon, rawLine: string, lineNumber: number) {
  const line = rawLine.replace(commentRegex, "");
  try {
    let result: RegExpMatchArray | null;
    if ((result = line.match(letRegex))) {
      //declaration
      const val = this.resolveStatement(result[2]);
      this.memory.set(result[1], val);
      report(`Variable "${result[1]}" created, value "${val}"`);
      return;
    } else if ((result = line.match(assignRegex))) {
      //reassignation
      const [, name, value] = result;
      if (this.memory.has(name)) {
        const val = this.resolveStatement(value);
        this.memory.set(name, val);
        report(`Variable "${name}" = "${val}"`);
        return;
      } else {
        throw konError({ variable: name, status: "not defined" });
      }
    }

    if ((result = line.match(execRegex))) {
      //method call
      const param = this.resolveStatement(result[2]);
      switch (result[1]) {
        case "print":
          console.log("[konprint] => ", param);
          break;
        default:
          //exec line idk
          return;
      }
    } else {
      return;
    }
  } catch (e) {
    console.trace(konError({ line, lineNumber: lineNumber.toString() }), e);
    process.exit();
  }
}
