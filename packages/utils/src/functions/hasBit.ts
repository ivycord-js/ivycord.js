/**
 * Checks if a bitfield has a specific bit.
 * @param bitfield The bitfield to check.
 * @param bit The bit to check.
 * @returns True if the bitfield has the bit, otherwise false.
 */
const hasBit = (bitfield: number, bit: number) => {
  return (bitfield & bit) === bit;
};

export { hasBit };
