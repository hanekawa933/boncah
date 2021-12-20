import React from "react";
import { Box, Text, Heading } from "@chakra-ui/react";

const Widget = ({ text, tanggal, percentage, number, icon }) => {
  return (
    <Box boxShadow="lg" borderRadius="lg" px="6" py="2">
      <Box px="3">
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          py="5"
        >
          <Text textTransform="capitalize" fontWeight="500">
            {text}
          </Text>
          <Text textTransform="uppercase" fontSize="small" color="gray.500">
            {tanggal}
          </Text>
        </Box>
        <Box display="flex" justifyContent="space-evenly">
          <Box>
            <Box display="flex" alignItems="center">
              <Text ml="5">{percentage}</Text>
            </Box>
            <Heading my="3" fontSize="2xl" textColor="gray.600">
              {number}
            </Heading>
          </Box>
          {icon}
        </Box>
      </Box>
    </Box>
  );
};

export default Widget;
