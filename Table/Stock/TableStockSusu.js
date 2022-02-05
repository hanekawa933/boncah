import React, { useState, useEffect, useMemo } from "react";
import { Box, Heading, Button, Skeleton, Text } from "@chakra-ui/react";
import { DownloadIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
    { names: "Jenis Susu", selector: "jenis_susu_id", sortable: true },
    { names: "Jumlah Paket", selector: "jumlah_paket", sortable: true },
    { names: "Jumlah Liter", selector: "jumlah_liter", sortable: true },
    { names: "Aksi", selector: "action", sortable: false, center: true },
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
            action: (
              <Box display="flex">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  mx="1"
                  size="sm"
                  onClick={() => openAndSetIds(res.id)}
                >
                  <EditIcon />
                </Button>
                <Button colorScheme="red" variant="solid" size="sm">
                  <DeleteIcon />
                </Button>
              </Box>
            ),
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

  let totalStockLiter = filteredItems.reduce(
    (sum, item) =>
      parseFloat(sum) +
      parseFloat(item.jumlah_liter.replace("liter", "").trim()),
    0
  );

  let totalStock = filteredItems.reduce(
    (sum, item) =>
      parseInt(sum) + parseInt(item.jumlah_paket.replace("liter", "").trim()),
    0
  );

  const columns = columnNames.map((res) => {
    return {
      name: res.names,
      selector: (row) => row[res.selector],
      sortable: res.sortable,
      center: res.center,
    };
  });

  return (
    <Box>
      <Heading fontSize="2xl" mt="7">
        Laporan Stock Susu
      </Heading>
      <Box display="flex" justifyContent="space-between" pt="5" px="5">
        <Skeleton isLoaded={loading}>
          <Box>
            <Text>Total Produksi (liter): {totalStockLiter} liter</Text>
            <Text>Total Produksi (paket): {totalStock} paket</Text>
          </Box>
        </Skeleton>
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
