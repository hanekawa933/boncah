import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FormPenjualanSusu, FormPenjualanPupuk } from "../../Form/Penjualan";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const Penjualan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Penjualan</title>
      </Head>
      <DashboardLayout>
        <Box px="3">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Susu</Tab>
                <Tab>Pupuk</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box mt="7">
                    <FormPenjualanSusu />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="7">
                    <FormPenjualanPupuk />
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

export default Penjualan;
