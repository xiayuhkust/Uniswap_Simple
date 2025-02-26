# Token Selection Component Testing Checklist

## Success Criteria for Token Selection Component

### Token List Display
- [ ] All tokens (TT1-TT8 and TURA) should be displayed in the token selection dropdown
- [ ] WTURA should be displayed as "TURA" in the UI
- [ ] Each token should display its correct symbol, name, and logo
- [ ] Token list should be populated from the unified TOKEN_METADATA in constants/tokenList.ts

### Token Selection Functionality
- [ ] Clicking on a token in the dropdown should select it and close the modal
- [ ] Selected token should be displayed in the token input field
- [ ] Token symbol should be displayed correctly (WTURA as TURA)
- [ ] Token logo should be displayed correctly

### Integration with Other Components
- [ ] Token selection should work in the Create Pool page
- [ ] Selected tokens should be properly passed to parent components
- [ ] Token symbols should be correctly displayed in pool creation forms

## Testing Steps
1. Navigate to http://localhost:5173/pool/create
2. Click on the "Select Token" button for either token input
3. Verify that all tokens (TT1-TT8 and TURA) are displayed in the dropdown
4. Select different tokens and verify that they are correctly displayed in the input field
5. Verify that WTURA is displayed as "TURA" in both the dropdown and input field
6. Complete the pool creation form with different token combinations to verify integration
