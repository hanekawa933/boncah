/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef } from "react";
import { Box, Button, Heading, Text, Skeleton } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import moment from "moment";
import "moment/locale/id";
import InputFilterTable from "../../components/InputFilterTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, DownloadIcon } from "@chakra-ui/icons";
import instance from "../../axios.default";

const TablePenjualanSusu = () => {
  const [query, setQuery] = useState(``);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [reportPenjualan, setReportPenjualan] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReportPenjualan = async (query) => {
    try {
      const report = await instance.get(`/susu/penjualan/report${query}`);
      const today = await instance.get(`/susu/penjualan/total${query}`);
      setReportPenjualan(report.data);
      setTotal(today.data);
      setLoading(true);
    } catch (error) {
      alert("ALLO");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReportPenjualan(query);
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
    { names: "Jenis Susu", selector: "jenis_susu_id" },
    { names: "Paket Terjual", selector: "jumlah_terjual_paket" },
    { names: "Liter Terjual", selector: "jumlah_terjual_liter" },
    { names: "Hasil Penjualan", selector: "hasil_penjualan" },
    { names: "Tanggal", selector: "tanggal" },
  ];

  const buttonSettings = [
    {
      name: "Bulan Lalu",
      query: "?search=prev_month",
    },
    { name: "Bulan Ini", query: "" },
    { name: "Hari ini", query: "?search=today" },
    {
      name: "Minggu ini",
      query: "?search=this_week",
    },
    {
      name: "Semua",
      query: "?search=all",
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
    reportPenjualan && reportPenjualan.data
      ? reportPenjualan.data.map((res, index) => {
          return {
            no: index + 1,
            jenis_susu_id:
              res.jenis_susu && res.jenis_susu.jenis_susu
                ? res.jenis_susu.jenis_susu
                : undefined,
            jumlah_terjual_paket: res.jumlah_terjual_paket + " paket",
            jumlah_terjual_liter: res.jumlah_terjual_liter + " liter",
            hasil_penjualan: numToIdr.format(res.hasil_penjualan),
            tanggal: moment(res.tanggal).format("Do MMMM YYYY"),
          };
        })
      : [];

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.jenis_susu_id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jumlah_terjual_liter
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.jumlah_terjual_paket
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.hasil_penjualan.toLowerCase().includes(filterText.toLowerCase()) ||
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
      `/susu/penjualan/report?search=custom&year=${year}&month=${month}&date=${date}`
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
          Laporan Penjualan Susu
        </Heading>
        <Box display="flex" justifyContent="space-between" px="5" pt="5">
          <Skeleton isLoaded={loading}>
            <Box>
              <Text>Total Paket Terjual: {total && total.data} paket</Text>
              <Text>
                Total Hasil Penjualan: {numToIdr.format(total && total.data2)}
              </Text>
            </Box>
          </Skeleton>
          <Button leftIcon={<DownloadIcon />} colorScheme="green" size="md">
            Unduh Laporan
          </Button>
        </Box>
        <Skeleton mt="5" isLoaded={loading}>
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

export default TablePenjualanSusu;
