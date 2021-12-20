import React from "react";
import { Box, Button } from "@chakra-ui/react";
import FormKandang from "../../Form/FormKandang";
import DashboardLayout from "../../layouts/dashboard";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import Head from "next/head";

const Kandang = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Buat Data Kandang</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <Link href="/dashboard/kambing" passHref>
              <Button leftIcon={<ArrowBackIcon />} colorScheme="blue" mb="5">
                Kembali
              </Button>
            </Link>
            <Box fontSize="1.4em" fontWeight="semibold" mb="5">
              Buat Kandang Kambing
            </Box>

            <FormKandang />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Kandang;
