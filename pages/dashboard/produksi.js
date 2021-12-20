import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FormProduksiSusu, FormProduksiPupuk } from "../../Form/Produksi";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const Produksi = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Produksi</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Susu</Tab>
                <Tab>Pupuk</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box mt="7">
                    <FormProduksiSusu />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="7">
                    <FormProduksiPupuk />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Produksi;
