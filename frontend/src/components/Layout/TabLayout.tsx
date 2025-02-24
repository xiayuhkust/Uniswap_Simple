import { FC, ReactNode } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

interface TabLayoutProps {
  swapContent: ReactNode;
  poolContent: ReactNode;
}

export const TabLayout: FC<TabLayoutProps> = ({ swapContent, poolContent }) => {
  return (
    <Tabs variant="soft-rounded" colorScheme="blue" width="100%">
      <TabList justifyContent="center" mb={4}>
        <Tab>Swap</Tab>
        <Tab>Pool</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{swapContent}</TabPanel>
        <TabPanel>{poolContent}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
