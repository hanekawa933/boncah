/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from "react";
import { Box, Button, Heading, Skeleton } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import moment from "moment";
import "moment/locale/id";
import InputFilterTable from "../../components/InputFilterTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, DownloadIcon } from "@chakra-ui/icons";
import instance from "../../axios.default";

const TableProduksiPupuk = () => {
  const [query, setQuery] = useState(`/pupuk/produksi/report`);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = React.useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportProduksiPupuk = async (query) => {
    try {
      const report = await instance.get(query);
      setReport(report.data);
      setLoading(true);
    } catch (error) {
      alert("ALLO");
    }
  };

  useEffect(() => {
    fetchReportProduksiPupuk(query);
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
    { names: "No", selector: "no" },
    { names: "Jumlah Produksi", selector: "jumlah_karung" },
    { names: "Tanggal", selector: "tanggal" },
  ];

  const buttonSettings = [
    {
      name: "Bulan Lalu",
      query: "/pupuk/produksi/report?search=prev_month",
    },
    { name: "Bulan Ini", query: "/pupuk/produksi/report" },
    { name: "Hari ini", query: "/pupuk/produksi/report?search=today" },
    {
      name: "Minggu ini",
      query: "/pupuk/produksi/report?search=this_week",
    },
    {
      name: "Semua",
      query: "/pupuk/produksi/report?search=all",
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
            jumlah_karung: res.jumlah_karung + " karung",
            tanggal: moment(res.tanggal).format("Do MMMM YYYY"),
          };
        })
      : [];

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.jumlah_karung.toLowerCase().includes(filterText.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(filterText.toLowerCase())
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

  const handleChangeWhenDateChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(
      `/pupuk/produuksi/report?search=custom&year=${year}&month=${month}&date=${date}`
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
          Laporan Produksi Pupuk
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
          />
        </Skeleton>
      </Box>
    </Box>
  );
};

export default TableProduksiPupuk;
