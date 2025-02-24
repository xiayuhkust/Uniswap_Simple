# Test Success Criteria

## UI Layout and Navigation
- [ ] Wallet connection button positioned in top right corner
- [ ] Navigation between Swap and Pool pages works correctly
- [ ] UI matches Uniswap V3 patterns and styling

## Pool List
- [ ] Pools sorted by 7-day volume in descending order
- [ ] Pool details displayed correctly:
  - Token pair with proper address formatting
  - Fee tier display
  - 7-day volume calculation
- [ ] Add liquidity button works for existing pools
- [ ] Empty state handled correctly

## Pool Creation
- [ ] Token selection works for both tokens
- [ ] Fee tier selection limited to:
  - 0.05%
  - 0.3%
  - 1%
- [ ] No custom fee tiers allowed
- [ ] Duplicate pool checking prevents creating existing pools
- [ ] Cannot modify parameters for existing pools

## Input Validation
- [ ] All numeric inputs prevent negative values
- [ ] Empty input states handled correctly
- [ ] Invalid input feedback shown to user
- [ ] Token amounts properly formatted with decimals

## Token Display
- [ ] WTURA displayed as "Tura" when appropriate
- [ ] Token symbols properly truncated to prevent overflow
- [ ] Token balances update in real-time
- [ ] Token search works case-insensitively

## Error Handling
- [ ] Network errors show appropriate messages
- [ ] Transaction failures handled gracefully
- [ ] Loading states shown during async operations
- [ ] User feedback for all important actions
