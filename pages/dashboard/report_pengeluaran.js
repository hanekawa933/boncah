import React from "react";
import { Box } from "@chakra-ui/react";
import TablePengeluaran from "../../table/TablePengeluaran";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const ReportPengeluaran = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Laporan Data Pengeluaran</title>
      </Head>
      <DashboardLayout>
        <Box px="3" pb="10">
          <Box p="10" boxShadow="lg" borderRadius="lg">
            <TablePengeluaran />
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ReportPengeluaran;
