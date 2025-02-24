import { Box, VStack, Text, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, HStack, Button } from '@chakra-ui/react'
import { useState } from 'react'

interface TickRangeInputProps {
  onRangeChange: (lowerTick: number, upperTick: number) => void
}

export function TickRangeInput({ onRangeChange }: TickRangeInputProps) {
  const [range, setRange] = useState([0, 100])

  const handleRangeChange = (newRange: number[]) => {
    setRange(newRange)
    // Convert percentage to tick values (-887220 to 887220)
    const lowerTick = Math.floor(-887220 + (newRange[0] / 100) * 1774440)
    const upperTick = Math.floor(-887220 + (newRange[1] / 100) * 1774440)
    onRangeChange(lowerTick, upperTick)
  }

  return (
    <Box width="100%">
      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" color="black">Step 2</Text>
        <Text fontSize="sm" color="gray.600">Set price range</Text>
      </Box>
      <VStack spacing={4} p={4} borderRadius="16px" borderWidth="1px" borderColor="uniswap.gray.200">
        <Text fontSize="sm" color="gray.600" width="100%">
          Select a price range to concentrate your liquidity and maximize your returns.
        </Text>
        <HStack width="100%" spacing={2}>
          <Button
            size="sm"
            variant={range[0] === 0 && range[1] === 100 ? "uniswap" : "outline"}
            onClick={() => handleRangeChange([0, 100])}
          >
            Full Range
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRangeChange([25, 75])}
          >
            Concentrated
          </Button>
        </HStack>
        <RangeSlider
          min={0}
          max={100}
          step={1}
          value={range}
          onChange={handleRangeChange}
          aria-label={['min price', 'max price']}
        >
          <RangeSliderTrack bg="uniswap.gray.200">
            <RangeSliderFilledTrack bg="uniswap.pink.500" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} boxSize={6} />
          <RangeSliderThumb index={1} boxSize={6} />
        </RangeSlider>
        <VStack width="100%" spacing={1} align="flex-start">
          <Text fontSize="sm" fontWeight="bold" color="black">Selected Range:</Text>
          <Text fontSize="sm" color="gray.600">
            Min Tick: {Math.floor(-887220 + (range[0] / 100) * 1774440)}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Max Tick: {Math.floor(-887220 + (range[1] / 100) * 1774440)}
          </Text>
        </VStack>
      </VStack>
    </Box>
  )
}
