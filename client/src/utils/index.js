import {
  uniqueNamesGenerator,
  colors,
  animals
 } from "unique-names-generator";

export const nameGen = () => {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: '-',
    length: 2,
  })
}
export const colorGen = () => {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`
}