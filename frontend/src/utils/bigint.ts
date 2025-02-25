export const DECIMALS = 18
export const Q96_SHIFT = 96n
export const ZERO_BIGINT = 0n
export const Q96 = 2n ** Q96_SHIFT

/**
 * Converts a decimal string to BigInt with proper decimal handling
 */
export function stringToBigInt(amount: string): bigint {
  if (!amount || isNaN(Number(amount))) return ZERO_BIGINT
  
  // Remove leading zeros and handle empty string
  amount = amount.replace(/^0+/, '') || '0'
  
  // Handle decimal points
  const scaled = amount.includes('.') 
    ? amount.padEnd(amount.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
    : amount + '0'.repeat(DECIMALS)
  
  return BigInt(scaled)
}

/**
 * Converts a BigInt to a decimal string with proper formatting
 */
export function bigIntToString(amount: bigint): string {
  const str = amount.toString()
  if (str.length <= DECIMALS) {
    return '0.' + str.padStart(DECIMALS, '0')
  }
  return str.slice(0, -DECIMALS) + '.' + str.slice(-DECIMALS)
}

/**
 * Calculates price from sqrtPriceX96
 */
export function calculatePrice(sqrtPriceX96: bigint): bigint {
  if (sqrtPriceX96 === ZERO_BIGINT) return ZERO_BIGINT;
  
  // Calculate price maintaining precision using bit shifting
  const squared = sqrtPriceX96 * sqrtPriceX96;
  const price = squared >> Q96_SHIFT;
  return price;
}

/**
 * Formats a price for display
 */
export function formatPrice(price: bigint, decimals: number = 6): string {
  if (price === ZERO_BIGINT) return '0.000000';
  // Scale price by decimals before Q96 division to maintain precision
  const scaledPrice = (price * BigInt(10 ** decimals));
  const priceWithDecimals = scaledPrice >> Q96_SHIFT;
  const priceStr = priceWithDecimals.toString().padStart(decimals + 1, '0');
  const integerPart = priceStr.slice(0, -decimals) || '0';
  const decimalPart = priceStr.slice(-decimals);
  return `${integerPart}.${decimalPart}`;
}
