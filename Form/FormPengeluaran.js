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

const FormPengeluaran = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [kategori, setKategori] = useState([]);
  const fetchKategoriPengeluaran = async () => {
    try {
      const res = await instance.get("/pengeluaran/kategori");
      setKategori(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchKategoriPengeluaran();
  }, []);

  const Schema = Yup.object().shape({
    pengeluaran: Yup.string().required("Input tidak boleh kosong"),
    pesan: Yup.string().required("Input tidak boleh kosong"),
    kategori_pengeluaran_id: Yup.number().required("Input tidak boleh kosong"),
    kategori_lainnya: Yup.string().when("kategori_pengeluaran_id", {
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

  const createPengeluaran = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);

    try {
      const res = await instance.post("/pengeluaran", body, config);
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
      pengeluaran: "",
      pesan: "",
      kategori_pengeluaran_id: "1",
      kategori_lainnya: "",
      tanggal: today,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      let val = {};

      val =
        values.kategori_pengeluaran_id === "999"
          ? {
              ...values,
              kategori_pengeluaran_id: values.kategori_lainnya,
            }
          : { kategori_lainnya, ...values };

      delete val.kategori_lainnya;
      await createPengeluaran(val);
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
              id="kategori_pengeluaran_id"
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
            <Field name="pengeluaran">
              {({ field, form }) => (
                <FormControl
                  id="pengeluaran"
                  isInvalid={Boolean(touched.pengeluaran && errors.pengeluaran)}
                  mt="5"
                >
                  <FormLabel>Pengeluaran</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="Rp." />
                    <NumberInput
                      defaultValue={0}
                      step={1000}
                      min={0}
                      {...field}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                      name="pengeluaran"
                      flex="1"
                    >
                      <NumberInputField
                        autoFocus={true}
                        {...getFieldProps("pengeluaran")}
                        onBlur={handleBlur}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  <FormErrorMessage>
                    {touched.pengeluaran && errors.pengeluaran}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <FormControl
              id="pesan"
              isInvalid={Boolean(touched.pesan && errors.pesan)}
              mt="5"
            >
              <FormLabel>Keterangan</FormLabel>
              <Textarea
                name="pesan"
                {...getFieldProps("pesan")}
                onBlur={handleBlur}
                resize="none"
              />
              <FormErrorMessage>
                {touched.pesan && errors.pesan}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="kategori_pengeluaran_id"
              isInvalid={Boolean(
                touched.kategori_pengeluaran_id &&
                  errors.kategori_pengeluaran_id
              )}
              mt="3"
            >
              <FormLabel>Kategori Pengeluaran</FormLabel>
              <Select
                type="text"
                name="kategori_pengeluaran_id"
                {...getFieldProps("kategori_pengeluaran_id")}
                onBlur={handleBlur}
              >
                {newOptionKategori}
              </Select>
              <FormErrorMessage>
                {touched.kategori_pengeluaran_id &&
                  errors.kategori_pengeluaran_id}
              </FormErrorMessage>
            </FormControl>
            <Box
              display={
                values.kategori_pengeluaran_id === "999" ? "initial" : "none"
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

export default FormPengeluaran;
