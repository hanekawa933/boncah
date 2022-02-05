import React, { useState, useEffect, useMemo } from "react";
import { Box, Heading, Button, Skeleton, Text } from "@chakra-ui/react";
import { DownloadIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
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
    { names: "No", selector: "no", sortable: true },
    { names: "Jumlah Karung", selector: "jumlah_karung", sortable: true },
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
            jumlah_karung: res.jumlah_karung + " liter",
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
    if (item.jumlah_karung.toLowerCase().includes(filterText.toLowerCase())) {
      return true;
    }
  });

  let totalStock = filteredItems.reduce(
    (sum, item) =>
      sum + parseInt(item.jumlah_karung.replace("karung", "").trim()),
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
        Laporan Stock Pupuk
      </Heading>
      <Box display="flex" justifyContent="space-between" px="5" pt="5">
        <Skeleton isLoaded={loading}>
          <Box>
            <Text>Total Produksi: {totalStock} karung</Text>
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

export default TableStockPupuk;
