/**
 * Validates and formats token amount input
 * - Removes leading zeros
 * - Ensures only one decimal point
 * - Only allows numbers and one decimal point
 */
export function validateAndFormatAmount(value: string): string {
  // Remove all non-numeric and non-decimal characters
  value = value.replace(/[^\d.]/g, '')
  
  // Handle multiple decimal points
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Remove leading zeros unless it's "0."
  if (!value.includes('.')) {
    value = value.replace(/^0+/, '') || '0'
  } else if (value.startsWith('0') && value.charAt(1) !== '.') {
    value = '0' + value.slice(value.indexOf('.'))
  }
  
  return value
}

/**
 * Checks if a string represents a valid token amount
 */
export function isValidAmount(value: string): boolean {
  if (value === '') return false
  if (value === '.') return false
  if (isNaN(Number(value))) return false
  if (Number(value) < 0) return false
  return true
}

/**
 * Formats a number for display by:
 * - Removing trailing zeros after decimal
 * - Removing decimal point if no decimals
 */
export function formatDisplayAmount(value: string): string {
  if (!value) return ''
  // Remove trailing zeros after decimal
  value = value.replace(/\.?0+$/, '')
  return value || '0'
}
