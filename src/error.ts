interface konErrorProperties {
  [name: string]: string;
}

export function konError(message: string | konErrorProperties) {
  return typeof message === "string"
    ? `[konError] => ${message}`
    : `[konError ${Object.entries(message).reduce(
        (acc, [key, value]) => acc + `${key}="${value}" `,
        ""
      )}] =>`;
}
