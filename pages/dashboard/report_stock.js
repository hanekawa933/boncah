import { Box } from "@chakra-ui/react";
import { TableStockSusu, TableStockPupuk } from "../../Table/Stock";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const ReportStock = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Stock</title>
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
                  <TableStockSusu />
                </TabPanel>
                <TabPanel>
                  <TableStockPupuk />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ReportStock;
