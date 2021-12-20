import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import {
  GraphProduksiPupukMonthly,
  GraphProduksiSusuMonthly,
  GraphProduksiPupukYearly,
  GraphProduksiSusuYearly,
} from "./index";

const GraphProduksi = () => {
  return (
    <Box>
      <Tabs colorScheme="purple" variant="soft-rounded" align="center">
        <TabList>
          <Tab width="36">Susu</Tab>
          <Tab width="36">Pupuk</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Tabs variant="soft-rounded" colorScheme="green" align="center">
              <TabList>
                <Tab>Grafik Pertahun</Tab>
                <Tab>Grafik Perbulan</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <GraphProduksiSusuYearly />
                </TabPanel>
                <TabPanel>
                  <GraphProduksiSusuMonthly />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <Tabs variant="soft-rounded" colorScheme="green" align="center">
              <TabList>
                <Tab>Grafik Pertahun</Tab>
                <Tab>Grafik Perbulan</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <GraphProduksiPupukYearly />
                </TabPanel>
                <TabPanel>
                  <GraphProduksiPupukMonthly />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GraphProduksi;
