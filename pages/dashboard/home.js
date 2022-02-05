/* eslint-disable react/display-name */
import { useEffect, useState, forwardRef } from "react";
import { Box, Heading, Button, Grid, Skeleton } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import Widget from "../../components/Widget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dataWidget from "../../data/widget.data";
import instance from "../../axios.default";
import moment from "moment";
import "moment/locale/id";
import DashboardLayout from "../../layouts/dashboard";
import Head from "next/head";

const Home = () => {
  const [query, setQuery] = useState(``);
  const [startDate, setStartDate] = useState(new Date());
  const [active, setActive] = useState([1]);
  const [hasilPerahan, setHasilPerahan] = useState([]);
  const [produksiSusu, setProduksiSusu] = useState([]);
  const [produksiPupuk, setProduksiPupuk] = useState([]);
  const [penjualanSusu, setPenjualanSusu] = useState([]);
  const [penjualanPupuk, setPenjualanPupuk] = useState([]);
  const [totalPenjualan, setTotalPenjualan] = useState([]);
  const [stockSusu, setStockSusu] = useState([]);
  const [stockPupuk, setStockPupuk] = useState([]);
  const [jumlahKambing, setJumlahKambing] = useState([]);
  const [loading, setLoading] = useState(false);

  // const todaysDate = new Date();
  const date = moment().format("Do-MMM-YYYY");

  const fetchAllTheData = async (query) => {
    const hasil_perahan = await instance.get(`/susu/perahan/total${query}`);
    const produksi_susu = await instance.get(`/susu/produksi/total${query}`);
    const produksi_pupuk = await instance.get(`/pupuk/produksi/total${query}`);
    const penjualan_susu = await instance.get(`/susu/penjualan/total${query}`);
    const penjualan_pupuk = await instance.get(
      `/pupuk/penjualan/total${query}`
    );
    const total_penjualan = await instance.get(`/penjualan/total${query}`);
    const stock_susu = await instance.get("/susu/stock/total");
    const stock_pupuk = await instance.get("/pupuk/stock/total");
    const jumlah_kambing = await instance.get("/kambing/jumlah_kambing");

    setHasilPerahan(hasil_perahan.data);
    setProduksiSusu(produksi_susu.data);
    setProduksiPupuk(produksi_pupuk.data);
    setPenjualanSusu(penjualan_susu.data);
    setPenjualanPupuk(penjualan_pupuk.data);
    setTotalPenjualan(total_penjualan.data);
    setStockSusu(stock_susu.data);
    setStockPupuk(stock_pupuk.data);
    setJumlahKambing(jumlah_kambing.data);
    setLoading(true);
  };

  useEffect(() => {
    fetchAllTheData(query);
  }, [query]);

  const kambeng = jumlahKambing && jumlahKambing.data ? jumlahKambing.data : [];
  const listOfWidget = dataWidget(
    !hasilPerahan.data ? 0 : hasilPerahan.data,
    !produksiSusu.data2 ? 0 : produksiSusu.data2,
    !produksiSusu.data ? 0 : produksiSusu.data,
    !produksiPupuk.data ? 0 : produksiPupuk.data,
    !stockSusu.data2 ? 0 : stockSusu.data2,
    !stockSusu.data ? 0 : stockSusu.data,
    !stockPupuk.data ? 0 : stockPupuk.data,
    !penjualanSusu.data ? 0 : penjualanSusu.data,
    !penjualanSusu.data2 ? 0 : penjualanSusu.data2,
    !penjualanPupuk.data ? 0 : penjualanPupuk.data,
    !penjualanPupuk.data2 ? 0 : penjualanPupuk.data2,
    !totalPenjualan.data ? 0 : totalPenjualan.data,
    !totalPenjualan.data2 ? 0 : totalPenjualan.data2,
    !kambeng.jantan ? 0 : kambeng.jantan,
    !kambeng.betina ? 0 : kambeng.betina,
    !kambeng.anakan ? 0 : kambeng.anakan,
    !kambeng.jumlah_kambing ? 0 : kambeng.jumlah_kambing,
    date
  ).map((widget, index) => {
    const { text, tanggal, percentage, number, icon, gridColumn } = widget;
    return (
      <Box gridColumn={gridColumn} key={index}>
        <Widget
          text={text}
          tanggal={tanggal}
          percentage={percentage}
          number={number}
          icon={icon}
        />
      </Box>
    );
  });

  const FullDatePicker = forwardRef(({ value, onClick }, ref) => (
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

  const MonthYearPicker = forwardRef(({ value, onClick }, ref) => (
    <Button
      colorScheme="blue"
      onClick={onClick}
      ref={ref}
      size="sm"
      mr="3"
      rightIcon={<CalendarIcon />}
      isActive={active.includes(6)}
    >
      {active.includes(6) ? value : "Pilih Bulan"}
    </Button>
  ));

  const YearPicker = forwardRef(({ value, onClick }, ref) => (
    <Button
      colorScheme="blue"
      onClick={onClick}
      ref={ref}
      size="sm"
      mr="3"
      rightIcon={<CalendarIcon />}
      isActive={active.includes(7)}
    >
      {active.includes(7) ? value : "Pilih Tahun"}
    </Button>
  ));

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

  const handleChangeWhenDateChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(`?search=custom&year=${year}&month=${month}&date=${date}`);
    setActive([5]);
    setLoading(false);
  };
  const handleChangeWhenMonthChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(`?search=custom&year=${year}&month=${month}`);
    setActive([6]);
    setLoading(false);
  };
  const handleChangeWhenYearChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(`?search=custom&year=${year}`);
    setActive([7]);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Utama</title>
      </Head>
      <DashboardLayout>
        <Box width="100%" pb="10" px="3">
          <Box mx="auto" borderRadius="xl" boxShadow="xl" p="10">
            <Heading mb="5" fontSize="2xl">
              Laporan
            </Heading>
            <Box display="flex" mb="3">
              <Box>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleChangeWhenDateChange(date)}
                  customInput={<FullDatePicker />}
                />
              </Box>
              <Box>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleChangeWhenMonthChange(date)}
                  customInput={<MonthYearPicker />}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                />
              </Box>
              <Box>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => handleChangeWhenYearChange(date)}
                  customInput={<YearPicker />}
                  dateFormat="yyyy"
                  showYearPicker
                />
              </Box>
              {buttonChoice}
            </Box>
            <Skeleton isLoaded={loading}>
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {listOfWidget}
              </Grid>
            </Skeleton>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Home;
