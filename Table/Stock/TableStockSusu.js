import React, { useState, useEffect, useMemo } from "react";
import { Box, Heading, Button, Skeleton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import DataTable from "react-data-table-component";
import "moment/locale/id";
import InputFilterTable from "../../components/InputFilterTable";
import "react-datepicker/dist/react-datepicker.css";
import instance from "../../axios.default";

const TableStockSusu = () => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllStockSusu = async () => {
    try {
      const res = await instance.get("/susu/stock");
      setReport(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchAllStockSusu();
  }, []);

  const columnNames = [
    { names: "No", selector: "no" },
    { names: "Jenis Susu", selector: "jenis_susu_id" },
    { names: "Jumlah Paket", selector: "jumlah_paket" },
    { names: "Jumlah Liter", selector: "jumlah_liter" },
  ];

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <InputFilterTable
        onFilterText={(e) => setFilterText(e.target.value)}
        clearFilter={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const dataTable =
    report && report.data
      ? report.data.map((res, index) => {
          return {
            no: index + 1,
            jenis_susu_id:
              res.jenis_susu && res.jenis_susu.jenis_susu
                ? res.jenis_susu.jenis_susu
                : undefined,
            jumlah_paket: res.jumlah_paket + " paket",
            jumlah_liter: res.jumlah_liter + " liter",
          };
        })
      : [];

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.jenis_susu_id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jumlah_liter.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jumlah_paket.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return true;
    }
  });

  const columns = columnNames.map((res) => {
    return {
      name: res.names,
      selector: (row) => row[res.selector],
      sortable: true,
    };
  });

  return (
    <Box>
      <Heading fontSize="2xl" mt="7">
        Laporan Stock Susu
      </Heading>
      <Box display="flex" justifyContent="end" px="5">
        <Button leftIcon={<DownloadIcon />} colorScheme="green" size="md">
          Unduh Laporan
        </Button>
      </Box>
      <Skeleton isLoaded={loading} mt="5">
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          highlightOnHover
          pointerOnHover
          position
        />
      </Skeleton>
    </Box>
  );
};

export default TableStockSusu;
