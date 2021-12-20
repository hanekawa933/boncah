import React, { useEffect, useState } from "react";
import { Bar as BarJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";
import { label } from "../../labels";
import instance from "../../../axios.default";

const GraphProduksiSusuMonthly = () => {
  const date = new Date().getFullYear();
  const currMonth = new Date().getUTCMonth() + 1;
  const [produksiSusuMonthly, setProduksiSusuMonthly] = useState([]);

  const [year, setYear] = useState(date);
  const [month, setMonth] = useState(currMonth);
  const [variant, setVariant] = useState("0");

  const monthLength = new Date(Date.UTC(year, month, 0)).getDate();

  const arrLabel = [];

  for (let i = 0; i < monthLength; i++) {
    arrLabel.push(i + 1);
  }

  const labelForTime =
    produksiSusuMonthly && produksiSusuMonthly.listOfJID
      ? produksiSusuMonthly.listOfJID.map((res) => {
          return {
            key: res.id,
            id: res.id.toString(),
            jenis_susu: res.jenis_susu,
          };
        })
      : [];

  const addNewLabel = [
    {
      key: 0,
      id: "0",
      jenis_susu: "Keseluruhan",
    },
    ...labelForTime,
  ];

  const fetchMonthlyProduksiSusu = async (query) => {
    try {
      const res = await instance.get(query);
      setProduksiSusuMonthly(res.data);
    } catch (error) {
      alert("ERROR FROM GRAPH PENJUALAN SUSU MONTHLY");
    }
  };

  useEffect(() => {
    month !== null && variant !== null
      ? fetchMonthlyProduksiSusu(
          `/susu/produksi/monthly?year=${year}&month=${month}&jenis_susu_id=${variant}`
        )
      : fetchMonthlyProduksiSusu(
          `/susu/produksi/monthly?year=${year}&jenis_susu_id=${variant}`
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, variant, year]);

  const arr = [];

  // for (let i = 0; i < keyObj.length; i++) {
  //   // eslint-disable-next-line no-unused-expressions
  //   data && data.result ? arr.push(data.result[0][keyObj[i]]) : null;
  // }

  for (let i = 0; i < monthLength; i++) {
    // eslint-disable-next-line no-unused-expressions
    if (produksiSusuMonthly && produksiSusuMonthly.result) {
      if (produksiSusuMonthly.result[0][i + 1] !== undefined) {
        arr.push(produksiSusuMonthly.result[0][i + 1]);
      }
    }
  }

  const graphData = {
    labels: arrLabel,
    datasets: [
      {
        label: "Hasil Produksi (paket)",
        data: arr,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const handleClickYear = (val) => {
    setYear(val);
  };

  const handleClickMonth = (val) => {
    setMonth(val);
  };

  const handleClickVariant = (val) => {
    setVariant(val);
  };

  const availableYear =
    produksiSusuMonthly && produksiSusuMonthly.listOfYear
      ? produksiSusuMonthly.listOfYear.map((res, index) => {
          return (
            <Button
              key={index}
              value={res.tahun}
              colorScheme={res.tahun === year ? "twitter" : "blackAlpha"}
              size="xs"
              mx="1"
              onClick={() => handleClickYear(res.tahun)}
            >
              {res.tahun}
            </Button>
          );
        })
      : [];

  const availableMonth = label
    ? label.map((res) => {
        return (
          <Button
            key={res.id}
            colorScheme={month === res.id ? "twitter" : "blackAlpha"}
            size="xs"
            mx="1"
            onClick={() => handleClickMonth(res.id)}
          >
            {res.name}
          </Button>
        );
      })
    : [];

  const availableVariant = addNewLabel
    ? addNewLabel.map((res) => {
        return (
          <Button
            key={res.id}
            colorScheme={
              variant === res.id.toString() ? "twitter" : "blackAlpha"
            }
            size="xs"
            mx="1"
            onClick={() => handleClickVariant(res.id.toString())}
          >
            {res.jenis_susu}
          </Button>
        );
      })
    : [];

  return (
    <Box>
      <Text fontWeight="700" fontSize="lg" py="5">
        Filter
      </Text>
      <Box
        p="4"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex">{availableYear}</Box>
        <Box display="flex" mt="3">
          {availableMonth}
        </Box>
        <Box display="flex" mt="3">
          {availableVariant}
        </Box>
      </Box>
      <Bar data={graphData} />
    </Box>
  );
};

export default GraphProduksiSusuMonthly;
