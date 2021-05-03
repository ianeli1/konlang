export const parenthesisRegex = /\((.*?)\)/;
export const mathRegex = /([a-zA-Z0-9]+) ?(\+|-|\*|\/) ?([a-zA-Z0-9]+)/;
export const variableName = /^[a-zA-Z][a-zA-Z0-9]*/;
export const letRegex = /^let (.*?) ?= ?(.*?)$/;
export const assignRegex = /^(.*?) ?= ?(.*?)$/;
export const execRegex = /^(.*?) *\((.*?)\)$/;
export const commentRegex = /\/\/.*/;
