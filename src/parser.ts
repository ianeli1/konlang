import {
  assignRegex,
  execRegex,
  letRegex,
  mathRegex,
  parenthesisRegex,
  valueRegex,
  variableName,
} from "./regex";

export interface TreeMember {
  /**
   * assign: let a = 1
   * value: 1 or "1"
   * var: a
   * call: print()
   */
  type: "assign" | "value" | "var" | "call";
  name: string;
  value: (string | number | TreeMember)[];
}

export function parse(input: string) {
  const program = input.split("\n");
  const tree: TreeMember["value"][0][] = [];

  while (program.length) {
    //todo: deal with multiline stuff
    const curr = program.shift();
    if (!curr) {
      break;
    }
    if (curr.startsWith("//")) {
      continue;
    }
    tree.push(parseLine(curr));
  }

  return tree;
}

function parseLine(input: string, child?: boolean): TreeMember["value"][0] {
  input = removeSpaces(input);
  //report(`[konParser] => Parsing line "${input}"`);

  let match;
  const error = `[konParser] => Syntax Error: on >${input}<`;

  try {
    if ((match = letRegex.exec(input))) {
      return {
        type: "assign",
        name: `*${match[1]}`,
        value: [parseLine(match[2], true)],
      };
    }
    if ((match = assignRegex.exec(input))) {
      return {
        type: "assign",
        name: match[1],
        value: [parseLine(match[2], true)],
      };
    }

    if ((match = execRegex.exec(input))) {
      return {
        type: "call",
        name: match[1],
        value: match[2].split(",").map((x) => parseLine(x, true)),
      };
    }
    if ((match = parenthesisRegex.exec(input))) {
      return {
        type: "value",
        name: "parenthesis",
        value: [parseLine(match[1], true)],
      };
    }
    if ((match = mathRegex.exec(input))) {
      return {
        type: "call",
        name: "_math",
        value: [parseLine(match[1], true), match[2], parseLine(match[3], true)], //a+b
      };
    }
    if (variableName.test(input)) {
      return {
        type: "var",
        name: input,
        value: [],
      };
    }
    if (valueRegex.test(input)) {
      return {
        type: "value",
        name: input[0] == '"' ? "string" : "number",
        value: [input],
      };
    }
  } catch (e) {
    const fullError = `${error}\n Prev:${e.message}`;
    if (child) {
      throw new Error(fullError);
    }

    console.error(fullError);
  }

  throw new Error(error);
}

const removeSpaces = (input: string) =>
  input
    .split(" ")
    .filter((l) => /(\S|\t)/.test(l))
    .join(" ");
