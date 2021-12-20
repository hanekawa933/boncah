import React, { useEffect, useState } from "react";
import { Bar as BarJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";

import { label } from "../../labels";
import instance from "../../../axios.default";

const GraphProduksiSusuYearly = () => {
  const date = new Date().getFullYear();
  const [year, setYear] = useState(date);
  const [produksiSusuYearly, setProduksiSusuYearly] = useState([]);

  const [month, setMonth] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]);

  const [variant, setVariant] = useState("0");

  const labelForTime =
    produksiSusuYearly && produksiSusuYearly.listOfJID
      ? produksiSusuYearly.listOfJID.map((res, index) => {
          return {
            key: index,
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

  const monthToIndex = month.map((res) => res - 1);

  const fetchYearlyProduksiSusu = async (query) => {
    try {
      const res = await instance.get(query);
      setProduksiSusuYearly(res.data);
    } catch (error) {
      alert("ERROR FROM GRAPH PENJUALAN SUSU YEARLY");
    }
  };
  useEffect(() => {
    month.length >= 1 && variant !== null
      ? fetchYearlyProduksiSusu(
          `/susu/produksi/yearly?year=${year}&month=${monthToIndex.join()}&jenis_susu_id=${variant}`
        )
      : fetchYearlyProduksiSusu(
          `/susu/produksi/yearly?year=${year}&jenis_susu_id=${variant}`
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, variant, year]);

  const keyObj = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ];

  const arr = [];

  // for (let i = 0; i < keyObj.length; i++) {
  //   // eslint-disable-next-line no-unused-expressions
  //   data && data.result ? arr.push(data.result[0][keyObj[i]]) : null;
  // }

  for (let i = 0; i < keyObj.length; i++) {
    // eslint-disable-next-line no-unused-expressions
    if (produksiSusuYearly && produksiSusuYearly.result) {
      if (produksiSusuYearly.result[0][keyObj[i]] !== undefined) {
        arr.push(produksiSusuYearly.result[0][keyObj[i]]);
      }
    }
  }

  const labelsFiltered = label
    .filter((res) => {
      return month.includes(res.id.toString());
    })
    .map((res) => {
      return res.name;
    });

  // const labelsUnfiltered = label.map((res) => {
  //   return res.name;
  // });

  const graphData = {
    labels: month.length >= 1 ? labelsFiltered : [],
    datasets: [
      {
        label: "Produksi Susu (paket)",
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
    if (month.includes(val)) {
      const filter = month.filter((values) => values !== val);
      setMonth(filter);
    } else {
      setMonth([...month, val]);
    }
  };

  const handleClickVariant = (val) => {
    setVariant(val);
  };

  const availableYear =
    produksiSusuYearly && produksiSusuYearly.listOfYear
      ? produksiSusuYearly.listOfYear.map((res, index) => {
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
            colorScheme={
              month.includes(res.id.toString()) ? "twitter" : "blackAlpha"
            }
            size="xs"
            mx="1"
            onClick={() => handleClickMonth(res.id.toString())}
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

export default GraphProduksiSusuYearly;
