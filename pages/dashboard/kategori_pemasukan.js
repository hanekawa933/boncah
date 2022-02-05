import React from "react";
import { Box, Button } from "@chakra-ui/react";
import FormKategoriPemasukan from "../../Form/FormKategoriPemasukan";
import DashboardLayout from "../../layouts/dashboard";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import Head from "next/head";

const Kategori_Pemasukan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Kategori Pemasukan</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Link href="/dashboard/pemasukan" passHref>
              <Button leftIcon={<ArrowBackIcon />} colorScheme="blue" mb="5">
                Kembali
              </Button>
            </Link>
            <Box fontSize="1.4em" fontWeight="semibold" mb="5">
              Buat Kategori Pemasukan
            </Box>
            <FormKategoriPemasukan />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Kategori_Pemasukan;
