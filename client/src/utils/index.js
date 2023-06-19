import {
  uniqueNamesGenerator,
  colors,
  animals
 } from "unique-names-generator";

export const uniqueName = uniqueNamesGenerator({
  dictionaries: [colors, animals],
  separator: '-',
  length: 2,
})