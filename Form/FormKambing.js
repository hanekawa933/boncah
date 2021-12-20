import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Select,
  Heading,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import Link from "next/link";
import instance from "../axios.default";

const FormKambing = () => {
  const [kebutuhanKambing, setKebutuhanKambing] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fetchKebutuhanKambing = async () => {
    try {
      const res = await instance.get("/kambing/kandang");
      setKebutuhanKambing(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchKebutuhanKambing();
  }, []);
  const Schema = Yup.object().shape({
    kambing: Yup.string("Input harus berupa file").required(
      "Input tidak boleh kosong"
    ),
    jenis_kambing_id: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    status_kambing_id: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    kandang_kambing_id: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
  });

  const optionKandang =
    kebutuhanKambing &&
    kebutuhanKambing.data &&
    kebutuhanKambing.data.kandang_kambing
      ? kebutuhanKambing.data.kandang_kambing.map((opt, index) => {
          return (
            <option key={index} value={opt.id}>
              {opt.kandang}
            </option>
          );
        })
      : [];

  const optionStatusKambing =
    kebutuhanKambing &&
    kebutuhanKambing.data &&
    kebutuhanKambing.data.status_kambing
      ? kebutuhanKambing.data.status_kambing.map((opt, index) => {
          return (
            <option key={index} value={opt.id}>
              {opt.status}
            </option>
          );
        })
      : [];

  const optionJenisKambing =
    kebutuhanKambing &&
    kebutuhanKambing.data &&
    kebutuhanKambing.data.jenis_kambing
      ? kebutuhanKambing.data.jenis_kambing.map((opt, index) => {
          return (
            <option key={index} value={opt.id}>
              {opt.jenis_kambing}
            </option>
          );
        })
      : [];
  const logoRef = useRef();

  const handleReset = () => {
    logoRef.current.value = ""; //THIS RESETS THE FILE FIELD
  };

  const createKambing = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await instance.post("/kambing", values, config);
      toast({
        title: "Input Berhasil",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: !error.response ? "Server Error" : error.response.data.msg,
        description: "Input Gagal!",
        status: "error",
        duration: 2000,
        position: "top",
      });
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      kambing: "",
      jenis_kambing_id: "",
      status_kambing_id: "",
      kandang_kambing_id: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const formData = new FormData();
      formData.append("kambing", values.kambing);
      formData.append("jenis_kambing_id", values.jenis_kambing_id);
      formData.append("status_kambing_id", values.status_kambing_id);
      formData.append("kandang_kambing_id", values.kandang_kambing_id);
      await createKambing(formData);
      resetForm({});
      setSubmitting(false);
      handleReset();
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    setFieldValue,
  } = formik;

  return (
    <Skeleton isLoaded={loading}>
      {kebutuhanKambing &&
      kebutuhanKambing.data &&
      kebutuhanKambing.data.kandang_kambing &&
      kebutuhanKambing.data.kandang_kambing.length > 0 ? (
        <Box>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <FormControl
                id="kambing"
                isInvalid={Boolean(touched.kambing && errors.kambing)}
              >
                <FormLabel>Foto Kambing</FormLabel>
                <Input
                  variant="flushed"
                  type="file"
                  name="kambing"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue("kambing", event.currentTarget.files[0]);
                  }}
                  ref={logoRef}
                />
                <FormErrorMessage>
                  {touched.kambing && errors.kambing}
                </FormErrorMessage>
              </FormControl>
              <Box display="flex" mt="6">
                <FormControl
                  id="jenis_kambing_id"
                  isInvalid={Boolean(
                    touched.jenis_kambing_id && errors.jenis_kambing_id
                  )}
                >
                  <FormLabel>Jenis Kambing</FormLabel>
                  <Select
                    placeholder="--Pilih Jenis Kambing--"
                    type="text"
                    name="jenis_kambing_id"
                    {...getFieldProps("jenis_kambing_id")}
                    onBlur={handleBlur}
                  >
                    {optionJenisKambing}
                  </Select>
                  <FormErrorMessage>
                    {touched.jenis_kambing_id && errors.jenis_kambing_id}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="status_kambing_id"
                  isInvalid={Boolean(
                    touched.status_kambing_id && errors.status_kambing_id
                  )}
                  ml="3"
                >
                  <FormLabel>Status Kambing</FormLabel>
                  <Select
                    placeholder="--Pilih Status Kambing--"
                    type="text"
                    name="status_kambing_id"
                    {...getFieldProps("status_kambing_id")}
                    onBlur={handleBlur}
                  >
                    {optionStatusKambing}
                  </Select>
                  <FormErrorMessage>
                    {touched.status_kambing_id && errors.status_kambing_id}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <FormControl
                id="kandang_kambing_id"
                isInvalid={Boolean(
                  touched.kandang_kambing_id && errors.kandang_kambing_id
                )}
                mt="3"
              >
                <FormLabel>Kandang Kambing</FormLabel>
                <Select
                  placeholder="--Pilih Kandang Kambing--"
                  type="text"
                  name="kandang_kambing_id"
                  {...getFieldProps("kandang_kambing_id")}
                  onBlur={handleBlur}
                >
                  {optionKandang}
                </Select>
                <FormErrorMessage>
                  {touched.kandang_kambing_id && errors.kandang_kambing_id}
                </FormErrorMessage>
              </FormControl>
              <Box display="flex" justifyContent="end">
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  mt="5"
                >
                  Masukan Data
                </Button>
              </Box>
            </Form>
          </FormikProvider>
        </Box>
      ) : (
        <Box
          mt="10"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading fontSize="lg">
            Kandang belum tersedia, buat kandang terlebih dahulu
          </Heading>
          <Link href="/dashboard/kandang" mt="5" passHref>
            <Button mt="5" colorScheme="blue">
              Buat Kandang Kambing
            </Button>
          </Link>
        </Box>
      )}
      ;
    </Skeleton>
  );
};

export default FormKambing;
