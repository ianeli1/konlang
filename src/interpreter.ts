import { executeLine } from "./line";
import { resolveMath } from "./math";
import { resolveStatement } from "./statement";

export class Kon {
  protected memory: Map<string, string>;
  constructor() {
    this.memory = new Map();
  }

  resolveStatement = resolveStatement;
  executeLine = executeLine;
  resolveMath = resolveMath.bind(this);
}
