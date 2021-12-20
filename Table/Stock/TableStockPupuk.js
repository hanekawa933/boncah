import React, { useState, useEffect, useMemo } from "react";
import { Box, Heading, Button, Skeleton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import DataTable from "react-data-table-component";
import "moment/locale/id";
import InputFilterTable from "../../components/InputFilterTable";
import "react-datepicker/dist/react-datepicker.css";
import instance from "../../axios.default";

const TableStockPupuk = () => {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllStockPupuk = async () => {
    try {
      const res = await instance.get("/pupuk/stock");
      setReport(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchAllStockPupuk();
  }, []);

  const columnNames = [
    { names: "No", selector: "no" },
    { names: "Jumlah Karung", selector: "jumlah_karung" },
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
            jumlah_karung: res.jumlah_karung + " liter",
          };
        })
      : [];

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (item.jumlah_karung.toLowerCase().includes(filterText.toLowerCase())) {
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
        Laporan Stock Pupuk
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

export default TableStockPupuk;
