import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import instance from "../axios.default";

const FormSusu = () => {
  const toast = useToast();
  const Schema = Yup.object().shape({
    jenis_susu: Yup.string("Input harus berupa string").required(
      "Input tidak boleh kosong"
    ),
  });

  const createSusu = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(values);
    try {
      const res = await instance.post("/susu/jenis_susu", body, config);
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
      jenis_susu: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await createSusu(values);
      resetForm({});
      setSubmitting(false);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
  } = formik;

  return (
    <Box>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <FormControl
            id="jenis_susu"
            isInvalid={Boolean(touched.jenis_susu && errors.jenis_susu)}
          >
            <FormLabel>Jenis Susu</FormLabel>
            <Input
              type="text"
              name="jenis_susu"
              {...getFieldProps("jenis_susu")}
              onBlur={handleBlur}
            />
            <FormErrorMessage>
              {touched.jenis_susu && errors.jenis_susu}
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
  );
};

export default FormSusu;
