import React, { useEffect, useState } from "react";
import { Bar as BarJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Box, Text, Button } from "@chakra-ui/react";
import { label } from "../labels";
import instance from "../../axios.default";

const GraphPerahanYearly = () => {
  const date = new Date().getFullYear();
  const [yearlyPerahan, setYearlyPerahan] = useState([]);
  const [year, setYear] = useState(date);
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

  const [time, setTime] = useState(["1", "2"]);

  const labelForTime =
    yearlyPerahan && yearlyPerahan.listOfTime
      ? yearlyPerahan.listOfTime.map((res, index) => {
          return {
            key: index,
            id: res.waktu_pemerahan_id.toString(),
            waktu: res.waktu_pemerahan.waktu,
          };
        })
      : [];

  const fetchYearlyHasilPerasan = async (query) => {
    try {
      const res = await instance.get(query);
      setYearlyPerahan(res.data);
    } catch (error) {
      alert("ERROR YEARLY PERAHAN");
    }
  };

  const monthInIndex = month.map((res) => res - 1);
  useEffect(() => {
    month.length >= 1 && time.length > 1
      ? fetchYearlyHasilPerasan(
          `/susu/perahan/yearly?year=${year}&month=${monthInIndex.join()}`
        )
      : month.length >= 1 && time.length < 1
      ? fetchYearlyHasilPerasan(
          `/susu/perahan/yearly?year=${year}&month=${monthInIndex.join()}`
        )
      : month.length >= 1 && time.length === 1
      ? fetchYearlyHasilPerasan(
          `/susu/perahan/yearly?year=${year}&month=${monthInIndex.join()}&time=${time.join()}`
        )
      : fetchYearlyHasilPerasan(`/susu/perahan/yearly?year=${year}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, time]);

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

  for (let i = 0; i < keyObj.length; i++) {
    // eslint-disable-next-line no-unused-expressions
    if (yearlyPerahan && yearlyPerahan.result) {
      if (yearlyPerahan.result[0][keyObj[i]] !== undefined) {
        arr.push(yearlyPerahan.result[0][keyObj[i]]);
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

  const handleClickWhen = (val) => {
    if (time.includes(val)) {
      const filter = time.filter((values) => values !== val);
      setTime(filter);
    } else {
      setTime([...time, val]);
    }
  };

  const availableYear =
    yearlyPerahan && yearlyPerahan.listOfYear
      ? yearlyPerahan.listOfYear.map((res, index) => {
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

  const graphData = {
    labels: month.length >= 1 && time.length >= 1 ? labelsFiltered : [],
    datasets: [
      {
        label: "Liter",
        data: arr,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <Box>
      <Text fontWeight="700" fontSize="lg" py="5">
        Filter
      </Text>
      <Box
        pb="4"
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
              text: "Hasil Perahan Dalam Setahun",
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

export default GraphPerahanYearly;
