import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  GraphPenjualanPupukMonthly,
  GraphPenjualanSusuMonthly,
  GraphPenjualanPupukYearly,
  GraphPenjualanSusuYearly,
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
                  <GraphPenjualanSusuYearly />
                </TabPanel>
                <TabPanel>
                  <GraphPenjualanSusuMonthly />
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
                  <GraphPenjualanPupukYearly />
                </TabPanel>
                <TabPanel>
                  <GraphPenjualanPupukMonthly />
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
