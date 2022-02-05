import React from "react";
import { Box, Button } from "@chakra-ui/react";
import FormKategoriPengeluaran from "../../Form/FormKategoriPengeluaran";
import DashboardLayout from "../../layouts/dashboard";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import Head from "next/head";

const Kategori_Pengeluaran = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Kategori Pengeluaran</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Link href="/dashboard/pengeluaran" passHref>
              <Button leftIcon={<ArrowBackIcon />} colorScheme="blue" mb="5">
                Kembali
              </Button>
            </Link>
            <Box fontSize="1.4em" fontWeight="semibold" mb="5">
              Buat Kategori Pengeluaran
            </Box>
            <FormKategoriPengeluaran />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Kategori_Pengeluaran;
