import React from "react";
import { Box, Button } from "@chakra-ui/react";
import FormKambing from "../../Form/FormKambing";
import DashboardLayout from "../../layouts/dashboard";
import { AddIcon } from "@chakra-ui/icons";
import Link from "next/link";
import Head from "next/head";

const Penjualan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Kambing</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              mb="5"
              alignItems="center"
            >
              <Box fontWeight="semibold" fontSize="1.4em">
                Kambing Produksi
              </Box>
              <Link href="/dashboard/kandang" passHref>
                <Button colorScheme="blue" leftIcon={<AddIcon />}>
                  Buat Kandang
                </Button>
              </Link>
            </Box>
            <FormKambing />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Penjualan;
