import React, { useEffect, useState } from "react";
import { Bar as BarJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";
import { label } from "../../labels";
import instance from "../../../axios.default";

const GraphPenjualanPupukYearly = () => {
  const date = new Date().getFullYear();
  const [year, setYear] = useState(date);
  const [penjualanPupukYearly, setPenjualanPupukYearly] = useState([]);

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

  const monthToIndex = month.map((res) => res - 1);

  const fetchYearlyPenjualanPupuk = async (query) => {
    try {
      const res = await instance.get(query);
      setPenjualanPupukYearly(res.data);
    } catch (error) {
      alert("ERROR FROM PENJUALAN PUPUK YEARLY");
    }
  };

  useEffect(() => {
    month.length >= 1
      ? fetchYearlyPenjualanPupuk(
          `/pupuk/penjualan/yearly?year=${year}&month=${monthToIndex.join()}`
        )
      : fetchYearlyPenjualanPupuk(`/pupuk/penjualan/yearly?year=${year}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

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
    if (penjualanPupukYearly && penjualanPupukYearly.result) {
      if (penjualanPupukYearly.result[0][keyObj[i]] !== undefined) {
        arr.push(penjualanPupukYearly.result[0][keyObj[i]]);
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
        label: "Produksi Pupuk (karung)",
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

  const availableYear =
    penjualanPupukYearly && penjualanPupukYearly.listOfYear
      ? penjualanPupukYearly.listOfYear.map((res, index) => {
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
      </Box>
      <Bar data={graphData} />
    </Box>
  );
};

export default GraphPenjualanPupukYearly;
