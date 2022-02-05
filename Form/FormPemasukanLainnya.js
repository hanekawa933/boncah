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
  Text,
  Textarea,
  InputGroup,
  InputLeftAddon,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import moment from "moment";
import "moment/locale/id";
import instance from "../axios.default";

const FormPemasukanLainnya = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [kategori, setKategori] = useState([]);
  const fetchKategoriPemasukan = async () => {
    try {
      const res = await instance.get("/penjualan/pemasukan/kategori");
      setKategori(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchKategoriPemasukan();
  }, []);

  const Schema = Yup.object().shape({
    pemasukan: Yup.string().required("Input tidak boleh kosong"),
    kategori_pemasukan_id: Yup.number().required("Input tidak boleh kosong"),
    kategori_lainnya: Yup.string().when("kategori_pemasukan_id", {
      is: 999,
      then: Yup.string().required("Input tidak boleh kosong"),
    }),
    tanggal: Yup.date().required("Input tidak boleh kosong"),
  });

  const optionKategori =
    kategori && kategori.data
      ? [...kategori.data, { id: "999", kategori: "Lainnya (Isi Sendiri)" }]
      : [];

  const newOptionKategori = optionKategori.map((opt, index) => {
    return (
      <option key={index} value={opt.id}>
        {opt.kategori}
      </option>
    );
  });

  const classDate = new Date();
  const today = classDate.toISOString().substr(0, 10);

  const createPemasukan = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);

    try {
      const res = await instance.post("/penjualan/pemasukan", body, config);
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
      pemasukan: "",
      kategori_pemasukan_id: "1",
      kategori_lainnya: "",
      tanggal: today,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      let val = {};

      val =
        values.kategori_pemasukan_id === "999"
          ? {
              ...values,
              kategori_pemasukan_id: values.kategori_lainnya,
            }
          : { kategori_lainnya, ...values };

      delete val.kategori_lainnya;
      await createPemasukan(val);
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
    values,
  } = formik;

  const numToIdr = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <Box mt="5">
      <Skeleton isLoaded={loading}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <FormControl
              id="kategori_pemasukan_id"
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
            <Field name="pemasukan">
              {({ field, form }) => (
                <FormControl
                  id="pemasukan"
                  isInvalid={Boolean(touched.pemasukan && errors.pemasukan)}
                  mt="5"
                >
                  <FormLabel>Pemasukan</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="Rp." />
                    <NumberInput
                      defaultValue={0}
                      step={1000}
                      min={0}
                      {...field}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                      name="pemasukan"
                      flex="1"
                    >
                      <NumberInputField
                        autoFocus={true}
                        {...getFieldProps("pemasukan")}
                        onBlur={handleBlur}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  <FormErrorMessage>
                    {touched.pemasukan && errors.pemasukan}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <FormControl
              id="kategori_pemasukan_id"
              isInvalid={Boolean(
                touched.kategori_pemasukan_id && errors.kategori_pemasukan_id
              )}
              mt="3"
            >
              <FormLabel>Jenis Pemasukan</FormLabel>
              <Select
                type="text"
                name="kategori_pemasukan_id"
                {...getFieldProps("kategori_pemasukan_id")}
                onBlur={handleBlur}
              >
                {newOptionKategori}
              </Select>
              <FormErrorMessage>
                {touched.kategori_pemasukan_id && errors.kategori_pemasukan_id}
              </FormErrorMessage>
            </FormControl>
            <Box
              display={
                values.kategori_pemasukan_id === "999" ? "initial" : "none"
              }
            >
              <FormControl
                id="kategori_lainnya"
                isInvalid={Boolean(
                  touched.kategori_lainnya && errors.kategori_lainnya
                )}
                mt="5"
              >
                <FormLabel>Tulis Kategori Lainnya:</FormLabel>
                <Input
                  type="text"
                  name="kategori_lainnya"
                  {...getFieldProps("kategori_lainnya")}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.kategori_lainnya && errors.kategori_lainnya}
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

export default FormPemasukanLainnya;
