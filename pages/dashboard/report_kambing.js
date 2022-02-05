import { Box } from "@chakra-ui/react";
import TableKandang from "../../Table/TableKandang";
import TableKambing from "../../Table/TableKambing";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const ReportProduksi = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Kambing</title>
      </Head>
      <DashboardLayout>
        <Box width="100%">
          <Box w="90%" mx="auto" borderRadius="xl" boxShadow="2xl" p="10">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>Kambing</Tab>
                <Tab>Kandang</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <TableKambing />
                </TabPanel>
                <TabPanel>
                  <TableKandang />
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
