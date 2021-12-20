import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Skeleton,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import moment from "moment";
import "moment/locale/id";
import instance from "../../axios.default";

const FormPenjualanSusu = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchStockTersedia = async () => {
    try {
      const res = await instance.get("/susu/produksi/stock");
      setStock(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR FORM");
    }
  };
  useEffect(() => {
    fetchStockTersedia();
  }, []);

  const date = new Date();
  const today = date.toISOString().substr(0, 10);

  const preparedData = stock && stock.data ? stock.data : [];
  const jenis =
    preparedData && preparedData.name ? preparedData.name : preparedData;
  const stockData =
    preparedData && preparedData.result ? preparedData.result : preparedData;

  let schemaFields = {
    tanggal: Yup.string().required("Input tidak boleh kosong"),
  };

  let initValues = {
    tanggal: today,
  };

  let inputValues = {};

  jenis.forEach((res) => {
    const jenis_susu = res.name.toLowerCase();
    const jumlah_terjual = `jumlah_terjual_${res.name.toLowerCase()}`;
    const hasil_penjualan = `hasil_penjualan_${res.name.toLowerCase()}`;
    const checkbox = `checkbox_${res.name.toLowerCase()}`;
    const tamu = `tamu_${res.name.toLowerCase()}`;

    schemaFields = {
      ...schemaFields,
      [jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
      [jumlah_terjual]: Yup.number().required("Input tidak boleh kosong"),
      [hasil_penjualan]: Yup.number().required("Input tidak boleh kosong"),
      [checkbox]: Yup.number().required("Input tidak boleh kosong"),
      [tamu]: Yup.string().required("Input tidak boleh kosong"),
    };

    initValues = {
      ...initValues,
      [jenis_susu]: res.id,
      [jumlah_terjual]: 0,
      [hasil_penjualan]: 0,
      [checkbox]: false,
      [tamu]: "",
    };
  });

  const Schema = Yup.object().shape(schemaFields);

  let inputData = (val) => {
    stockData.forEach((res) => {
      // if (res.jumlah_paket > 0) {
      const jenis_susu =
        res.jenis_susu && res.jenis_susu.jenis_susu
          ? res.jenis_susu.jenis_susu.toLowerCase()
          : undefined;
      const jumlah_terjual = `jumlah_terjual_${jenis_susu.toLowerCase()}`;
      const hasil_penjualan = `hasil_penjualan_${jenis_susu.toLowerCase()}`;
      const checkbox = `checkbox_${jenis_susu.toLowerCase()}`;
      const tamu = `tamu_${jenis_susu.toLowerCase()}`;

      inputValues = {
        ...inputValues,
        tanggal: val.tanggal,
        [jenis_susu]: res.jenis_susu_id,
        [jumlah_terjual]: val[jumlah_terjual],
        [hasil_penjualan]: val[hasil_penjualan],
        [checkbox]: val[checkbox],
        [tamu]: val[checkbox],
      };
      // }
    });

    return inputValues;
  };

  const createPenjualanSusu = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const res = await axios.post("/susu/penjualan", body, config);
      toast({
        title: "Berhasil login",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: !error.response ? "Server Error" : error.response.data.msg,
        description: "Gagal login!",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await createPenjualanSusu(inputData(values));
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
    handleChange,
    setFieldValue,
    values,
  } = formik;

  const numToIdr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const option = stockData.map((res) => {
    if (res === null) {
      return null;
    } else {
      const jenis_susu =
        res && res.jenis_susu && res.jenis_susu.jenis_susu
          ? res.jenis_susu.jenis_susu
          : undefined;
      const jumlah_terjual =
        jenis_susu === undefined
          ? ""
          : `jumlah_terjual_${jenis_susu.toLowerCase()}`;
      const hasil_penjualan =
        jenis_susu === undefined
          ? ""
          : `hasil_penjualan_${jenis_susu.toLowerCase()}`;
      const checkbox =
        jenis_susu === undefined ? "" : `checkbox_${jenis_susu.toLowerCase()}`;
      const tamu =
        jenis_susu === undefined ? "" : `tamu_${jenis_susu.toLowerCase()}`;
      return (
        <Box mt="5">
          <Box display="flex" key={res.id} alignItems="center">
            <Box w="75%">
              <Text fontWeight="700" textTransform="uppercase">
                {jenis_susu}
              </Text>
              {res.jumlah_paket <= 0 ? (
                <Text fontSize="md" textColor="red.500">
                  Stock tidak tersedia
                </Text>
              ) : (
                <Text fontSize="md" textColor="green.500">
                  Tersedia {res.jumlah_paket} paket
                </Text>
              )}
            </Box>
            <Field name={jumlah_terjual}>
              {({ field, form }) => (
                <FormControl
                  id={jumlah_terjual}
                  isInvalid={Boolean(
                    touched[jumlah_terjual] && errors[jumlah_terjual]
                  )}
                >
                  <FormLabel>Jumlah Penjualan</FormLabel>
                  <InputGroup>
                    <NumberInput
                      min={0}
                      max={res.jumlah_paket}
                      {...field}
                      onChange={(val) => {
                        form.setFieldValue(field.name, val);
                        values[checkbox] === true
                          ? setFieldValue(hasil_penjualan, 0)
                          : setFieldValue(
                              hasil_penjualan,
                              (parseInt(val) * 6500).toFixed(2)
                            );
                      }}
                      name={jumlah_terjual}
                      isDisabled={res.jumlah_paket <= 0 ? true : false}
                    >
                      <NumberInputField
                        {...getFieldProps(jumlah_terjual)}
                        onBlur={handleBlur}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <InputRightAddon children="paket" />
                  </InputGroup>
                  <FormErrorMessage>
                    {touched[jumlah_terjual] && errors[jumlah_terjual]}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name={hasil_penjualan}>
              {({ field, form }) => (
                <FormControl
                  id={hasil_penjualan}
                  isInvalid={Boolean(
                    touched[hasil_penjualan] && errors[hasil_penjualan]
                  )}
                >
                  <FormLabel>Hasil Penjualan</FormLabel>
                  <InputGroup>
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <InputLeftAddon children="Rp." />
                    <NumberInput
                      min={0}
                      precision={2}
                      {...field}
                      onChange={(val) => {
                        form.setFieldValue(field.name, val);
                      }}
                      name={hasil_penjualan}
                      isDisabled={
                        res.jumlah_paket <= 0 || values[checkbox] ? true : false
                      }
                    >
                      <NumberInputField
                        {...getFieldProps(hasil_penjualan)}
                        onBlur={handleBlur}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  <FormErrorMessage>
                    {touched[hasil_penjualan] && errors[hasil_penjualan]}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <FormControl
              id={checkbox}
              isInvalid={Boolean(touched[checkbox] && errors[checkbox])}
              width="10%"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <FormLabel>Tamu</FormLabel>
              <Checkbox
                colorScheme="green"
                name={checkbox}
                onChange={handleChange}
              ></Checkbox>
              <FormErrorMessage>
                {touched[checkbox] && errors[checkbox]}
              </FormErrorMessage>
            </FormControl>
          </Box>
          <Box display={values[checkbox] === true ? "initial" : "none"}>
            <FormControl
              id={tamu}
              isInvalid={Boolean(touched[tamu] && errors[tamu])}
            >
              <FormLabel>Nama tamu</FormLabel>
              <Input
                type="text"
                name={tamu}
                {...getFieldProps(tamu)}
                onBlur={handleBlur}
              />
              <FormErrorMessage>
                {touched[tamu] && errors[tamu]}
              </FormErrorMessage>
            </FormControl>
            <Text fontSize="xs" color="gray.600" mt="1">
              Jika tamu lebih dari satu silahkan pisah dengan tanda koma (,)
            </Text>
          </Box>
        </Box>
      );
    }
  });

  return (
    <Box mt="5">
      <Skeleton isLoaded={loading}>
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
            <Box>
              {stockData.includes(null) ? (
                <Text fontSize="2em" mt="5" textAlign="center">
                  Stock belum tersedia.
                </Text>
              ) : (
                <>
                  {option}
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
                </>
              )}
            </Box>
          </Form>
        </FormikProvider>
      </Skeleton>
    </Box>
  );
};

export default FormPenjualanSusu;
