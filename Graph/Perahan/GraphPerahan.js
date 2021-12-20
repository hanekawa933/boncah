import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { GraphPerahanMonthly, GraphPerahanYearly } from "./index";

const GraphPerahan = () => {
  return (
    <Box>
      <Tabs variant="soft-rounded" colorScheme="green" align="center">
        <TabList>
          <Tab>Grafik Pertahun</Tab>
          <Tab>Grafik Perbulan</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <GraphPerahanYearly />
          </TabPanel>
          <TabPanel>
            <GraphPerahanMonthly />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GraphPerahan;
