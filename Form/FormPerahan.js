/* eslint-disable react/no-children-prop */
import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Select,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightAddon,
  useToast,
  Skeleton,
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import moment from "moment";
import "moment/locale/id";
import instance from "../axios.default";

const FormPerahan = () => {
  const toast = useToast();
  const [waktu, setWaktu] = useState([]);
  const [keterangan, setKeterangan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWaktuDanKeterangan = async () => {
    try {
      const waktu = await instance.get("/susu/waktu");
      setWaktu(waktu.data);
      const keterangan = await instance.get("/susu/keterangan");
      setKeterangan(keterangan.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };
  useEffect(() => {
    fetchWaktuDanKeterangan();
  }, []);
  const Schema = Yup.object().shape({
    hasil_perahan: Yup.number("Input harus berupa ankga").required(
      "Input tidak boleh kosong"
    ),
    hasil_berkurang: Yup.number("Input harus berupa ankga").required(
      "Input tidak boleh kosong"
    ),
    waktu_pemerahan_id: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    keterangan_pemerahan_id: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    keterangan_lainnya: Yup.string().when("keterangan_pemerahan_id", {
      is: 999,
      then: Yup.string().required("Input tidak boleh kosong"),
    }),
    tanggal: Yup.date().required("Input tidak boleh kosong"),
  });

  const optionWaktuPemerahan =
    waktu && waktu.data
      ? waktu.data.map((opt, index) => {
          return (
            <option key={index} value={opt.id}>
              {opt.waktu}
            </option>
          );
        })
      : "";

  const newKeterangan =
    keterangan && keterangan.data
      ? [...keterangan.data, { id: 999, keterangan: "Lainnya (Isi Sendiri)" }]
      : [];

  const optionKeterangan = newKeterangan.map((opt, index) => {
    return (
      <option key={index} value={opt.id}>
        {opt.keterangan}
      </option>
    );
  });

  const classDate = new Date();
  const today = classDate.toISOString().substr(0, 10);

  const createPerahanSusu = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const res = await instance.post("/susu/perahan", body, config);
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
    }
  };

  const formik = useFormik({
    initialValues: {
      hasil_perahan: "",
      hasil_berkurang: "",
      keterangan_pemerahan_id: 1,
      keterangan_lainnya: "",
      waktu_pemerahan_id: 1,
      tanggal: today,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      let val = {};

      val =
        values.keterangan_pemerahan_id === "999"
          ? {
              ...values,
              keterangan_pemerahan_id: values.keterangan_lainnya,
            }
          : { keterangan_lainnya, ...values };

      delete val.keterangan_lainnya;
      await createPerahanSusu(val);
      setSubmitting(false);
      resetForm({});
    },
    enableReinitialize: true,
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    values,
    setFieldValue,
  } = formik;

  return (
    <Box mt="5">
      <Skeleton isLoaded={loading}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <FormControl
              id="tanggal"
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
            <Box display="flex" mt="3">
              <Field name="hasil_perahan">
                {({ field, form }) => (
                  <FormControl
                    id="hasil_perahan"
                    isInvalid={Boolean(
                      touched.hasil_perahan && errors.hasil_perahan
                    )}
                  >
                    <FormLabel>Hasil Perahan</FormLabel>
                    <InputGroup>
                      <NumberInput
                        defaultValue={0}
                        precision={3}
                        step={0.2}
                        min={values.hasil_berkurang}
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        name="hasil_perahan"
                        width="90%"
                      >
                        <NumberInputField
                          autoFocus={true}
                          {...getFieldProps("hasil_perahan")}
                          onBlur={handleBlur}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <InputRightAddon
                        children="liter"
                        flex="1"
                        justifyContent="center"
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {touched.hasil_perahan && errors.hasil_perahan}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="hasil_berkurang">
                {({ field, form }) => (
                  <FormControl
                    id="hasil_berkurang"
                    isInvalid={Boolean(
                      touched.hasil_berkurang && errors.hasil_berkurang
                    )}
                    ml="3"
                  >
                    <FormLabel>Pengurangan Susu</FormLabel>
                    <InputGroup>
                      <NumberInput
                        defaultValue={0}
                        precision={3}
                        step={0.2}
                        min={0}
                        max={values.hasil_perahan}
                        {...field}
                        onChange={(val) => {
                          form.setFieldValue(field.name, val);

                          if (parseInt(val) <= 0) {
                            setFieldValue("keterangan_pemerahan_id", 3);
                          }
                        }}
                        name="hasil_berkurang"
                        width="90%"
                      >
                        <NumberInputField
                          {...getFieldProps("hasil_berkurang")}
                          onBlur={handleBlur}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <InputRightAddon
                        children="liter"
                        flex="1"
                        justifyContent="center"
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {touched.hasil_berkurang && errors.hasil_berkurang}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box display="flex">
              <FormControl
                id="waktu_pemerahan_id"
                isInvalid={Boolean(
                  touched.waktu_pemerahan_id && errors.waktu_pemerahan_id
                )}
                mt="3"
              >
                <FormLabel>Waktu Pemerahan</FormLabel>
                <Select
                  type="text"
                  name="waktu_pemerahan_id"
                  {...getFieldProps("waktu_pemerahan_id")}
                  onBlur={handleBlur}
                >
                  {optionWaktuPemerahan}
                </Select>
                <FormErrorMessage>
                  {touched.waktu_pemerahan_id && errors.waktu_pemerahan_id}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="keterangan_pemerahan_id"
                isInvalid={Boolean(
                  touched.keterangan_pemerahan_id &&
                    errors.keterangan_pemerahan_id
                )}
                mt="3"
                ml="3"
              >
                <FormLabel>Keterangan Pengurangan</FormLabel>
                <Select
                  name="keterangan_pemerahan_id"
                  {...getFieldProps("keterangan_pemerahan_id")}
                  onBlur={handleBlur}
                >
                  {optionKeterangan}
                </Select>
                <FormErrorMessage>
                  {touched.keterangan_pemerahan_id &&
                    errors.keterangan_pemerahan_id}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box
              display={
                values.keterangan_pemerahan_id === "999" ? "initial" : "none"
              }
            >
              <FormControl
                id="keterangan_lainnya"
                isInvalid={Boolean(
                  touched.keterangan_lainnya && errors.keterangan_lainnya
                )}
                mt="5"
              >
                <FormLabel>Tulis Keterangan Lainnya:</FormLabel>
                <Input
                  type="text"
                  name="keterangan_lainnya"
                  {...getFieldProps("keterangan_lainnya")}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.keterangan_lainnya && errors.keterangan_lainnya}
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
      </Skeleton>
    </Box>
  );
};

export default FormPerahan;
