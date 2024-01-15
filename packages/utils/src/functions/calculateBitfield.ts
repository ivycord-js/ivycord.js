/**
 * Uses the bitwise OR operator to combine all provided bits into a single number.
 * @param bits An array of numbers representing bits.
 * @returns The calculated bitfield as a number.
 */
const calculateBitfield = (bits: number[]) => {
  return bits.reduce((a, b) => a | b, 0);
};

export { calculateBitfield };
