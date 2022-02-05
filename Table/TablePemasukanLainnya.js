/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from "react";
import { Box, Button, Heading, Skeleton, Text } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import moment from "moment";
import "moment/locale/id";
import InputFilterTable from "../components/InputFilterTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarIcon,
  DownloadIcon,
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import instance from "../axios.default";

const TablePemasukanLainnya = () => {
  const [query, setQuery] = useState(`/penjualan/pemasukan/report`);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = React.useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportPengeluaran = async (dispatch) => {
    try {
      const res = await instance.get(query);
      setReport(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchReportPengeluaran(query);
  }, [query]);

  const numToIdr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      colorScheme="blue"
      onClick={onClick}
      ref={ref}
      size="sm"
      mr="3"
      rightIcon={<CalendarIcon />}
      isActive={active.includes(5)}
    >
      {active.includes(5) ? value : "Pilih Tanggal"}
    </Button>
  ));

  const columnNames = [
    { names: "No", selector: "no", sortable: true },
    { names: "Tanggal", selector: "tanggal", sortable: true },
    { names: "Pemasukan", selector: "pemasukan", sortable: true },
    {
      names: "Jenis Pemasukan",
      selector: "kategori_pemasukan_id",
      sortable: true,
    },
    { names: "Aksi", selector: "action", center: true, sortable: false },
  ];

  const buttonSettings = [
    {
      name: "Bulan Lalu",
      query: "/penjualan/pemasukan/report?search=prev_month",
    },
    { name: "Bulan Ini", query: "/penjualan/pemasukan/report" },
    { name: "Hari ini", query: "/penjualan/pemasukan/report?search=today" },
    {
      name: "Minggu ini",
      query: "/penjualan/pemasukan/report?search=this_week",
    },
    {
      name: "Semua",
      query: "/penjualan/pemasukan/report?search=all",
    },
  ];

  const onClickToSetQuery = (q, id) => {
    setQuery(q);
    setActive([id]);
    setLoading(false);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
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

  const buttonChoice = buttonSettings.map((res, index) => {
    return (
      <Button
        isActive={active.includes(index)}
        key={index}
        colorScheme="blue"
        size="sm"
        mr="3"
        onClick={() => onClickToSetQuery(res.query, index)}
      >
        {res.name}
      </Button>
    );
  });

  const dataTable =
    report && report.data
      ? report.data.map((res, index) => {
          return {
            no: index + 1,
            tanggal: moment(res.tanggal).format("Do MMMM YYYY"),
            pemasukan: numToIdr.format(res.pemasukan),
            kategori_pemasukan_id:
              res.kategori_pemasukan && res.kategori_pemasukan.kategori
                ? res.kategori_pemasukan.kategori
                : undefined,
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
      item.pemasukan.toLowerCase().includes(filterText.toLowerCase()) ||
      item.kategori_pemasukan_id
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return true;
    }
  });

  let totalPemasukan = filteredItems.reduce(
    (sum, item) =>
      parseFloat(sum) +
      parseFloat(item.pemasukan.replace("Rp", "").trim().replaceAll(".", "")),
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

  const handleChangeWhenDateChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(
      `/penjualan/pemasukan/report?search=custom&year=${year}&month=${month}&date=${date}`
    );
    setActive([5]);
    setLoading(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center">
        <Box width={active.includes(5) ? "8rem" : "8.5rem"}>
          <DatePicker
            selected={startDate}
            onChange={(date) => handleChangeWhenDateChange(date)}
            customInput={<ExampleCustomInput />}
          />
        </Box>
        {buttonChoice}
      </Box>
      <Box>
        <Heading fontSize="2xl" mt="7">
          Laporan Pemasukan Lainnya
        </Heading>
        <Box display="flex" justifyContent="space-between" pt="5" px="5">
          <Skeleton isLoaded={loading}>
            <Box>
              <Text>
                Total Hasil Pemasukan: {numToIdr.format(totalPemasukan)}
              </Text>
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
          />
        </Skeleton>
      </Box>
    </Box>
  );
};

export default TablePemasukanLainnya;
