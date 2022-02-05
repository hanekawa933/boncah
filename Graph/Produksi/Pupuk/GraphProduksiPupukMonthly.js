import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";
import instance from "../../../axios.default";
import { label } from "../../labels";

const GraphProduksiPupukMonthly = () => {
  const date = new Date().getFullYear();
  const currMonth = new Date().getUTCMonth() + 1;
  const [produksiPupukMonthly, setProduksiPupukMonthly] = useState([]);

  const [year, setYear] = useState(date);
  const [month, setMonth] = useState(currMonth);

  const monthLength = new Date(Date.UTC(year, month, 0)).getDate();

  const arrLabel = [];

  for (let i = 0; i < monthLength; i++) {
    arrLabel.push(i + 1);
  }

  const fetchMonthlyProduksiPupuk = async (query) => {
    try {
      const res = await instance.get(query);
      setProduksiPupukMonthly(res.data);
      console.log(res.data);
    } catch (error) {
      alert("ERROR FROM GRAPH PRODUKSI PUPUK");
    }
  };

  useEffect(() => {
    month !== null
      ? fetchMonthlyProduksiPupuk(
          `/pupuk/produksi/monthly?year=${year}&month=${month}`
        )
      : fetchMonthlyProduksiPupuk(`/pupuk/produksi/monthly?year=${year}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const arr = [];

  // for (let i = 0; i < keyObj.length; i++) {
  //   // eslint-disable-next-line no-unused-expressions
  //   data && data.result ? arr.push(data.result[0][keyObj[i]]) : null;
  // }

  for (let i = 0; i < monthLength; i++) {
    // eslint-disable-next-line no-unused-expressions
    if (produksiPupukMonthly && produksiPupukMonthly.result) {
      if (produksiPupukMonthly.result[0][i + 1] !== undefined) {
        arr.push(produksiPupukMonthly.result[0][i + 1]);
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

  const availableYear =
    produksiPupukMonthly && produksiPupukMonthly.listOfYear
      ? produksiPupukMonthly.listOfYear.map((res, index) => {
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

export default GraphProduksiPupukMonthly;
