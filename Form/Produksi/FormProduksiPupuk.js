/* eslint-disable react/no-children-prop */
import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Text,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/id";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import instance from "../../axios.default";

const FormProduksiPupuk = () => {
  const toast = useToast();
  const Schema = Yup.object().shape({
    jumlah_karung: Yup.number()
      .typeError("Input harus berupa angka")
      .required("Input tidak boleh kosong"),
    tanggal: Yup.string().required("Input tidak boleh kosong"),
  });

  const classDate = new Date();
  const today = classDate.toISOString().substr(0, 10);

  const createProduksiPupuk = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const res = await instance.post("/pupuk/produksi", body, config);
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
      jumlah_karung: "",
      tanggal: today,
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      await createProduksiPupuk(values);
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
  return (
    <Box mt="5">
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
          <Field name="jumlah_karung">
            {({ field, form }) => (
              <FormControl
                id="jumlah_karung"
                mt="5"
                isInvalid={Boolean(
                  touched.jumlah_karung && errors.jumlah_karung
                )}
              >
                <FormLabel>Hasil Produksi</FormLabel>
                <InputGroup>
                  <NumberInput
                    defaultValue={0}
                    {...field}
                    onChange={(val) => form.setFieldValue(field.name, val)}
                    name="jumlah_karung"
                    width="90%"
                  >
                    <NumberInputField
                      autoFocus={true}
                      {...getFieldProps("jumlah_karung")}
                      onBlur={handleBlur}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <InputRightAddon
                    children="karung"
                    flex="1"
                    justifyContent="center"
                  />
                </InputGroup>
                <FormErrorMessage>
                  {touched.jumlah_karung && errors.jumlah_karung}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
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

export default FormProduksiPupuk;
