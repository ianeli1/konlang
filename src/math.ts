import { Kon } from "./interpreter";
import { variableName } from "./regex";

export function resolveMath(
  this: Kon,
  rawVar1: string,
  op: string,
  rawVar2: string
) {
  function pad(val: number) {
    return Number.isNaN(val) ? undefined : val;
  }

  const var1 = variableName.test(rawVar1)
    ? pad(+(this.memory.get(rawVar1) ?? NaN))
    : +rawVar1;
  const var2 = variableName.test(rawVar2)
    ? pad(+(this.memory.get(rawVar2) ?? NaN))
    : +rawVar2;

  if (!var1 || !var2) {
    return undefined;
  }

  switch (op) {
    case "+":
      return pad(+var1 + +var2) + "";
    case "-":
      return pad(+var1 - +var2) + "";
    case "*":
      return pad(+var1 * +var2) + "";
    case "/":
      return Math.floor(+var1 / +var2) + "";
    default:
      return undefined;
  }
}
