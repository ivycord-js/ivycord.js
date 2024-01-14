/**
 * Uses the bitwise OR operator to combine all provided bits into a single number.
 * @param bits An array of numbers representing bits.
 * @returns The calculated bitfield as a number.
 */
const calculateBitfield = (bits: number[]) => {
  return bits.reduce((a, b) => a | b, 0);
};

/**
 * Checks if a bitfield has a specific bit.
 * @param bitfield The bitfield to check.
 * @param bit The bit to check.
 * @returns True if the bitfield has the bit, otherwise false.
 */
const hasBit = (bitfield: number, bit: number) => {
  return (bitfield & bit) === bit;
};

export { calculateBitfield, hasBit };
