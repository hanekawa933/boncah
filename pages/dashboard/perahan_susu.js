import React from "react";
import { Box } from "@chakra-ui/react";
import FormPerahan from "../../form/FormPerahan";
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
            <FormPerahan />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Perahan;
