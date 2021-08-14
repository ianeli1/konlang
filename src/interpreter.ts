import { executeLine } from "./line";
import { resolveMath } from "./math";
import { resolveStatement } from "./statement";
import type { parse, TreeMember } from "./parser";

export class Kon {
  protected memory: Map<string, string | number | TreeMember | undefined>;
  constructor() {
    this.memory = new Map();
  }

  resolveStatement = resolveStatement;
  executeLine = executeLine;
  resolveMath = resolveMath.bind(this);

  evaluateOne(
    input: ReturnType<typeof parse>[0]
  ): ReturnType<typeof parse>[0] | undefined {
    if (typeof input != "object") {
      return input;
    }

    switch ((input as TreeMember).type) {
      case "assign":
        {
          if (input.name[0] !== "*" && !this.memory.has(input.name)) {
            throw new Error(
              `[konEval] => Unassigned variable name >${input.name}<`
            );
          }
          const newVal = this.evaluateOne(input.value[0]);

          this.memory.set(input.name.replace("*", ""), newVal);
          return newVal;
        }
        break;
      case "call":
        {
          const val = input.value.map((x) => this.evaluateOne(x));
          switch (input.name) {
            case "print":
              console.log("[konprint] => ", ...val);
              return undefined;
            case "_math": {
              const [v1, op, v2] = val as [
                number | string,
                string,
                number | string
              ];
              if ([v1, v2].some((v) => typeof v === "string")) {
                throw new Error(
                  `[konMath] => Operation '${op}' is not supported for values ${JSON.stringify(
                    v1
                  )} and ${JSON.stringify(v2)}`
                );
              }

              switch (op) {
                case "+":
                  return (v1 as number) + (v2 as number);
                case "-":
                  return (v1 as number) - (v2 as number);
                case "*":
                  return (v1 as number) * (v2 as number);
                case "/":
                  return Math.floor((v1 as number) / (v2 as number));
                default:
                  return undefined;
              }
            }

            default:
              //todo lol
              return 1;
          }
        }
        break;
      case "var":
        {
          if (!this.memory.has(input.name)) {
            throw new Error(
              `[konEval] => Variable '${input.name}' is not defined!`
            );
          }

          return this.memory.get(input.name)!;
        }
        break;
      case "value":
        {
          if (input.name === "string") {
            return (input.value[0] as string).slice(1, -1);
          }
          if (input.name === "number") {
            return +input.value[0];
          }
          if (input.name === "parenthesis") {
            return this.evaluateOne(input.value[0]);
          }
        }
        break;

      default:
        return undefined;
    }
    return undefined;
  }
}
