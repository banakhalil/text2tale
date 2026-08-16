// export const STAR_GRADIENT = ["#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b"];
export const STAR_GRADIENT = [
  "#fff0b5",
  "#fde68a",
  "#ffe561",
  "#fbdb3a",
  "#faca1c",
];
const STAR_EMPTY = "#d1d5db";

export const getStarColor = (index: number, rating: number): string =>
  index < rating ? STAR_GRADIENT[index] : STAR_EMPTY;
