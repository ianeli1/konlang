import { konError } from "./error";
import { Kon } from "./interpreter";
import { mathRegex, parenthesisRegex, variableName } from "./regex";

export function resolveStatement(this: Kon, rawStatement: string): string {
  function ifMathFail(val: string | undefined) {
    if (!val) throw konError({ rawStatement });
    return val;
  }

  let statement = rawStatement;
  let result: RegExpMatchArray | null;
  while ((result = statement.match(parenthesisRegex))) {
    statement = statement.replace(result[0], this.resolveStatement(result[1]));
  }

  while ((result = statement.match(mathRegex))) {
    statement = statement.replace(
      result[0],
      ifMathFail(
        this.resolveMath(...(result.slice(1, 4) as [string, string, string]))
      )
    );
  }

  if (variableName.test(statement))
    return ifMathFail(this.memory.get(statement));

  return statement;
}
