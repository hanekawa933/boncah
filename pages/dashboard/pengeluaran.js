import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import FormPengeluaran from "../../Form/FormPengeluaran";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const Penjualan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Pengeluaran</title>
      </Head>
      <DashboardLayout>
        <Box px="3">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <FormPengeluaran />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Penjualan;
