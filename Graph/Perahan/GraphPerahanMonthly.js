import React, { useEffect, useState } from "react";
import { Bar as BarJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";
import { label } from "../labels";
import instance from "../../axios.default";

const GraphPerahanMonthly = () => {
  const date = new Date().getFullYear();
  const currMonth = new Date().getUTCMonth() + 1;
  const [monthlyPerahan, setMonthlyPerahan] = useState([]);
  const [year, setYear] = useState(date);
  const [month, setMonth] = useState(currMonth);
  const [time, setTime] = useState(["1", "2"]);

  const monthLength = new Date(Date.UTC(year, month, 0)).getDate();

  const arrLabel = [];

  for (let i = 0; i < monthLength; i++) {
    arrLabel.push(i + 1);
  }

  const fetchMonthlyHasilPerasan = async (query) => {
    try {
      const res = await instance.get(query);
      setMonthlyPerahan(res.data);
    } catch (error) {
      alert("ERROR FROM MONTHLY PERAHAN");
    }
  };

  useEffect(() => {
    month !== null && time.length > 1
      ? fetchMonthlyHasilPerasan(
          `/susu/perahan/monthly?year=${year}&month=${month}`
        )
      : month >= 1 && time.length < 1
      ? fetchMonthlyHasilPerasan(
          `/susu/perahan/monthly?year=${year}&month=${month}`
        )
      : month >= 1 && time.length === 1
      ? fetchMonthlyHasilPerasan(
          `/susu/perahan/monthly?year=${year}&month=${month}&time=${time.join()}`
        )
      : fetchMonthlyHasilPerasan(
          `/susu/perahan/monthly?year=${year}&month=${month}`
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, time, year]);

  const labelForTime =
    monthlyPerahan && monthlyPerahan.listOfTime
      ? monthlyPerahan.listOfTime.map((res, index) => {
          return {
            key: index,
            id: res.waktu_pemerahan_id.toString(),
            waktu: res.waktu_pemerahan.waktu,
          };
        })
      : [];

  const arr = [];

  // for (let i = 0; i < keyObj.length; i++) {
  //   // eslint-disable-next-line no-unused-expressions
  //   data && data.result ? arr.push(data.result[0][keyObj[i]]) : null;
  // }

  for (let i = 0; i < monthLength; i++) {
    // eslint-disable-next-line no-unused-expressions
    if (monthlyPerahan && monthlyPerahan.result) {
      if (monthlyPerahan.result[0][i + 1] !== undefined) {
        arr.push(monthlyPerahan.result[0][i + 1]);
      }
    }
  }

  const graphData = {
    labels: time.length >= 1 ? arrLabel : [],
    datasets: [
      {
        label: "Liter",
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

  const handleClickWhen = (val) => {
    if (time.includes(val)) {
      const filter = time.filter((values) => values !== val);
      setTime(filter);
    } else {
      setTime([...time, val]);
    }
  };

  const availableYear =
    monthlyPerahan && monthlyPerahan.listOfYear
      ? monthlyPerahan.listOfYear.map((res, index) => {
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

  const availableTime = labelForTime
    ? labelForTime.map((res) => {
        return (
          <Button
            key={res.id}
            colorScheme={
              time.includes(res.id.toString()) ? "twitter" : "blackAlpha"
            }
            onClick={() => handleClickWhen(res.id.toString())}
            size="xs"
            mx="1"
          >
            {res.waktu}
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
          {availableTime}
        </Box>
      </Box>
      <Bar
        data={graphData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Hasil Perahan Dalam Sebulan",
              fontSize: "24px",
            },
            legend: {
              display: true,
              position: "left",
            },
          },
        }}
      />
    </Box>
  );
};

export default GraphPerahanMonthly;
