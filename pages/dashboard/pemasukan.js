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
import { FormPenjualanSusu, FormPenjualanPupuk } from "../../Form/Penjualan";
import FormPemasukanLainnya from "../../Form/FormPemasukanLainnya";
import { AddIcon } from "@chakra-ui/icons";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";
import Link from "next/link";

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
                <Tab>Penjualan</Tab>
                <Tab>Lainnya</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box>
                    <Tabs variant="soft-rounded" colorScheme="purple">
                      <TabList
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Tab>Penjualan Susu</Tab>
                        <Tab>Penjualan Pupuk</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          <Box mt="7">
                            <Box as="h1" fontWeight="700" fontSize="1.3em">
                              Pemasukan Penjualan Susu
                            </Box>
                            <FormPenjualanSusu />
                          </Box>
                        </TabPanel>
                        <TabPanel>
                          <Box mt="7">
                            <Box as="h1" fontWeight="700" fontSize="1.3em">
                              Pemasukan Penjualan Pupuk
                            </Box>
                            <FormPenjualanPupuk />
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="7">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box as="h1" fontWeight="700" fontSize="1.3em">
                        Pemasukan Penjualan Lainnya
                      </Box>
                      <Link href="/dashboard/kategori_pemasukan" passHref>
                        <a>
                          <Button colorScheme="blue" leftIcon={<AddIcon />}>
                            Tambah Kategori
                          </Button>
                        </a>
                      </Link>
                    </Box>
                    <FormPemasukanLainnya />
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
