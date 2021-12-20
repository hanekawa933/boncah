import React from "react";
import { Container, Flex, Box, Heading, Text, Divider } from "@chakra-ui/react";
import AuthLogin from "../components/Auth/AuthLogin";
import Head from "next/head";

const Login = () => {
  return (
    <>
      <Head>
        <title>Boncah Utama | Halaman Login</title>
      </Head>
      <Container maxWidth="100%">
        <Flex p="5" alignItems="center">
          <Box
            borderRadius="lg"
            borderWidth="1"
            maxW="md"
            h="2xl"
            p="10"
            boxShadow="xl"
            display={["none", "none", "none", "inline", "inline", "inline"]}
          >
            Disini Logo
            <Heading as="h1" size="lg" mt="20">
              Halo, Selamat Datang...
            </Heading>
            <Box
              as="object"
              type="image/svg+xml"
              data="/svg/home.svg"
              maxW="100%"
              mt="32"
            ></Box>
          </Box>
          <Box w="lg" mx="auto" my="40" p={["0", "0", "0", "5"]}>
            <Heading as="h1" size="lg">
              Login ke Boncah Utama
            </Heading>
            <Text fontSize="lg" py="5" color="gray.500">
              Masukan kelengkapan data anda.
            </Text>
            <Divider mt="5" mb="10" />
            <AuthLogin />
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default Login;
