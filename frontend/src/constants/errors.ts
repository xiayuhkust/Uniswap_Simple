export const INPUT_ERRORS = {
  INVALID_FORMAT: "Invalid amount format",
  ZERO_AMOUNT: "Amount must be greater than 0",
  EMPTY_AMOUNT: "Please enter an amount",
  MULTIPLE_DECIMALS: "Only one decimal point allowed",
  INVALID_RANGE: "Invalid price range",
  INVALID_CHARACTERS: "Only numbers and decimal point allowed",
  POOL_EXISTS: "Pool already exists",
  SAME_TOKEN: "Cannot select the same token",
  NO_TOKENS: "Please select both tokens",
  NO_FEE: "Please select a fee tier"
} as const

export type InputError = keyof typeof INPUT_ERRORS
