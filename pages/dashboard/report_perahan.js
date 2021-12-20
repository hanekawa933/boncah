import React from "react";
import { Box } from "@chakra-ui/react";
import TablePerahan from "../../Table/TablePerahan";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const ReportPerahan = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Perahan</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <TablePerahan />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ReportPerahan;
