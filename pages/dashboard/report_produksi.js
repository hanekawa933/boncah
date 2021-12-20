import { Box } from "@chakra-ui/react";
import { TableProduksiSusu, TableProduksiPupuk } from "../../Table/Produksi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const ReportProduksi = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Produksi</title>
      </Head>
      <DashboardLayout>
        <Box width="100%">
          <Box w="90%" mx="auto" borderRadius="xl" boxShadow="2xl" p="10">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Susu</Tab>
                <Tab>Pupuk</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <TableProduksiSusu />
                </TabPanel>
                <TabPanel>
                  <TableProduksiPupuk />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ReportProduksi;
