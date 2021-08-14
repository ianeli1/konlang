export const parenthesisRegex = /^\((.*?)\)$/;
export const mathRegex = /^(.*?) ?(\+|-|\*|\/) ?(.*?)$/;
export const variableName = /^[a-zA-Z][a-zA-Z0-9]*$/;
export const letRegex = /^let ([a-zA-Z][a-zA-Z0-9]*) ?= ?(.*?)$/;
export const assignRegex = /^([a-zA-Z][a-zA-Z0-9]*) ?= ?(.*?)$/;
export const execRegex = /^([a-zA-Z][a-zA-Z0-9]*) *\((.*?)\)$/;
export const commentRegex = /\/\/.*/;
export const valueRegex = /^([0-9]+|".*?")$/;
