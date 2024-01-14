/**
 * Uses the bitwise OR operator to combine all provided bits into a single number.
 * @param bits An array of numbers representing bits.
 * @returns The calculated bitfield as a number.
 */
const calculateBitfield = (bits: number[] | number) => {
  if (typeof bits === 'number') return bits;
  let bitfield = 0;
  bitfield = bits.reduce((acc, bit) => acc | bit, bitfield);
  return bitfield;
};

const hasBit = (bitfield: number, bit: number) => {
  return (bitfield & bit) === bit;
};

export { calculateBitfield, hasBit };
