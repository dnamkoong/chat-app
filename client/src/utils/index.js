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
};

export const format = (seconds) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const pad = (string) => {
  return ('0' + string).slice(-2);
}