import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { GraphPenjualan, GraphPerahan, GraphProduksi } from "../../Graph";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const GraphPage = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Grafik</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box borderRadius="lg" boxShadow="lg" p="10">
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab>Perahan</Tab>
                <Tab>Produksi</Tab>
                <Tab>Penjualan</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <GraphPerahan />
                </TabPanel>
                <TabPanel>
                  <GraphProduksi />
                </TabPanel>
                <TabPanel>
                  <GraphPenjualan />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default GraphPage;
