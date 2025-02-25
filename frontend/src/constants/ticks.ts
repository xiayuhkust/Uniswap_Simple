// Constants from TickMath.sol
export const MIN_TICK = -887272
export const MAX_TICK = 887272

/**
 * Validates that the given tick range is valid according to TickMath constraints
 * @param lower The lower tick of the range
 * @param upper The upper tick of the range
 * @returns true if the range is valid, false otherwise
 */
export const validateTicks = (lower: number, upper: number): boolean => {
  return (
    lower >= MIN_TICK && 
    upper <= MAX_TICK && 
    lower < upper
  )
}

/**
 * Gets the nearest valid tick for a given tick that satisfies tick spacing
 * @param tick The tick to round
 * @param tickSpacing The spacing between ticks
 * @returns The nearest valid tick
 */
export const nearestValidTick = (tick: number, tickSpacing: number): number => {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  if (rounded < MIN_TICK) return MIN_TICK
  if (rounded > MAX_TICK) return MAX_TICK
  return rounded
}
