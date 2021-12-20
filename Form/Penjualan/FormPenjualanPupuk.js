/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Select,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import moment from "moment";
import "moment/locale/id";
import instance from "../../axios.default";

const FormPenjualanPupuk = () => {
  const toast = useToast();
  const Schema = Yup.object().shape({
    jumlah_terjual: Yup.number("Input harus berupa ankga").required(
      "Input tidak boleh kosong"
    ),
    hasil_penjualan: Yup.number("Input harus berupa ankga").required(
      "Input tidak boleh kosong"
    ),
    tanggal: Yup.date().required("Input tidak boleh kosong"),
  });

  const date = new Date();
  const today = date.toISOString().substr(0, 10);

  const createPenjualanPupuk = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const res = await instance.post("/pupuk/penjualan", body, config);
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
      jumlah_terjual: "",
      hasil_penjualan: "",
      tanggal: today,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await createPenjualanPupuk(values);
      setSubmitting(false);
      resetForm({});
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    handleChange,
    values,
    setFieldValue,
  } = formik;

  const customHandleChange = (e) => {
    let { value } = e.target;
    setFieldValue("jumlah_terjual", value);
    setFieldValue("hasil_penjualan", value * 10000);
  };
  const numToIdr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return (
    <Box mt="5">
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <FormControl
            id="keterangan_pemerahan_id"
            pt="5"
            isInvalid={Boolean(touched.tanggal && errors.tanggal)}
          >
            <FormLabel>Tanggal</FormLabel>
            <Input
              type="date"
              name="tanggal"
              {...getFieldProps("tanggal")}
              onBlur={handleBlur}
            />
            <FormErrorMessage>
              {touched.tanggal && errors.tanggal}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" mt="5">
            <FormControl
              id="jumlah_terjual"
              isInvalid={Boolean(
                touched.jumlah_terjual && errors.jumlah_terjual
              )}
            >
              <FormLabel>Jumlah Terjual</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  name="jumlah_terjual"
                  {...getFieldProps("jumlah_terjual")}
                  onBlur={handleBlur}
                  onChange={customHandleChange}
                  value={values.jumlah_terjual}
                />
                <InputRightAddon children="karung" />
              </InputGroup>
              <FormErrorMessage>
                {touched.jumlah_terjual && errors.jumlah_terjual}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="hasil_penjualan"
              isInvalid={Boolean(
                touched.hasil_penjualan && errors.hasil_penjualan
              )}
              ml="3"
            >
              <FormLabel>Hasil Penjualan</FormLabel>
              <InputGroup>
                <InputLeftAddon children="Rp." />
                <Input
                  type="number"
                  name="hasil_penjualan"
                  {...getFieldProps("hasil_penjualan")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.hasil_penjualan}
                />
              </InputGroup>
              <FormErrorMessage>
                {touched.hasil_penjualan && errors.hasil_penjualan}
              </FormErrorMessage>
            </FormControl>
          </Box>
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
  );
};

export default FormPenjualanPupuk;
