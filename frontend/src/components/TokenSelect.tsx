import { FC, useMemo, useState } from 'react';
import { Box, Input, VStack, List, ListItem, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Token, TEST_TOKENS } from '../types/token';

interface TokenSelectProps {
  onSelect: (token: Token) => void;
  selectedToken?: Token;
}

export const TokenSelect: FC<TokenSelectProps> = ({ onSelect, selectedToken }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTokens = useMemo(() => {
    return TEST_TOKENS.filter(token => 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <>
      <Box 
        onClick={onOpen}
        cursor="pointer"
        p={2}
        borderWidth="1px"
        borderRadius="md"
      >
        {selectedToken ? (
          <Text>{selectedToken.symbol}</Text>
        ) : (
          <Text color="gray.500">Select token</Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Search by name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <List spacing={2} width="100%">
                {filteredTokens.map(token => (
                  <ListItem
                    key={token.address}
                    onClick={() => {
                      onSelect(token);
                      onClose();
                    }}
                    p={2}
                    cursor="pointer"
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Text>{token.symbol} - {token.name}</Text>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
