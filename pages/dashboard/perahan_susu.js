import React from "react";
import { Box } from "@chakra-ui/react";
import FormPerahan from "../../Form/FormPerahan";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const Perahan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Perahan Susu</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Box as="h1" fontWeight="700" fontSize="1.3em">
              Produksi Perahan Susu
            </Box>
            <FormPerahan />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Perahan;
