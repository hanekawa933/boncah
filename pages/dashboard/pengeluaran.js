import React from "react";
import { Box, Button } from "@chakra-ui/react";
import FormPengeluaran from "../../Form/FormPengeluaran";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";
import Link from "next/link";
import { AddIcon } from "@chakra-ui/icons";

const Pengeluaran = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Pengeluaran</title>
      </Head>
      <DashboardLayout>
        <Box px="3">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box as="h1" fontWeight="700" fontSize="1.3em">
                Pengeluaran Produksi
              </Box>
              <Link href="/dashboard/kategori_pengeluaran">
                <a>
                  <Button colorScheme="blue" leftIcon={<AddIcon />}>
                    Tambah Kategori
                  </Button>
                </a>
              </Link>
            </Box>
            <FormPengeluaran />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Pengeluaran;
