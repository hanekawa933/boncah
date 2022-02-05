import { Box } from "@chakra-ui/react";
import { TablePenjualanSusu, TablePenjualanPupuk } from "../../Table/Penjualan";
import TabelPemasukanLainnya from "../../Table/TablePemasukanLainnya";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";
const ReportPenjualan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Penjualan</title>
      </Head>
      <DashboardLayout>
        <Box width="100%">
          <Box w="90%" mx="auto" borderRadius="xl" boxShadow="2xl" p="10">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Penjualan</Tab>
                <Tab>Lainnya</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Tabs variant="soft-rounded" colorScheme="purple">
                    <TabList
                      justifyContent="center"
                      display="flex"
                      alignItems="center"
                    >
                      <Tab>Penjualan Susu</Tab>
                      <Tab>Penjualan Pupuk</Tab>
                    </TabList>
                    <TabPanels mt="5">
                      <TabPanel>
                        <TablePenjualanSusu />
                      </TabPanel>
                      <TabPanel>
                        <TablePenjualanPupuk />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                <TabPanel>
                  <TabelPemasukanLainnya />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ReportPenjualan;
