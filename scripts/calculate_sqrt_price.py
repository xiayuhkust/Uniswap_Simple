import math

Q96 = 2**96

def calculate_sqrt_price(ratio):
    return int((ratio ** 0.5) * Q96)

# Calculate sqrt prices
wtura_tt_ratio = 1/100  # 1:100 ratio for WTURA:TT pairs
equal_ratio = 1  # 1:1 ratio for TT1:TT2 pair

print(f"WTURA/TT ratio sqrt price: {calculate_sqrt_price(wtura_tt_ratio)}")
print(f"Equal ratio sqrt price: {calculate_sqrt_price(equal_ratio)}")
