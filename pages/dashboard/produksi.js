import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FormProduksiSusu, FormProduksiPupuk } from "../../Form/Produksi";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";
import Link from "next/link";

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
                <Tab>Produksi Susu</Tab>
                <Tab>Produksi Pupuk</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box mt="7">
                    <Box
                      justifyContent="space-between"
                      display="flex"
                      alignItems="center"
                    >
                      <Text as="h1" fontSize="1.2em" fontWeight="700">
                        Produksi Susu
                      </Text>
                      <Link href="/dashboard/jenis_susu" passHref>
                        <a>
                          <Button colorScheme="blue" leftIcon={<AddIcon />}>
                            Tambah Jenis Susu
                          </Button>
                        </a>
                      </Link>
                    </Box>
                    <FormProduksiSusu />
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="7">
                    <Text as="h1" fontSize="1.2em" fontWeight="700">
                      Produksi Pupuk
                    </Text>
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
