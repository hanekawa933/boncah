/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  NumberInput,
  NumberInputStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  InputGroup,
  InputRightAddon,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/id";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider, Field } from "formik";
import instance from "../../axios.default";

const FormProduksiSusu = () => {
  const toast = useToast();
  const [jenisSusu, setJenisSusu] = useState([]);
  const [loading, setLoading] = useState(false);
  const getJenisSusu = async () => {
    try {
      const res = await instance.get("/jenis_susu");
      setJenisSusu(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    getJenisSusu();
    // eslint-disable-next-line no-unused-expressions
  }, []);
  const classDate = new Date();
  const today = classDate.toISOString().substr(0, 10);

  const preparedData = jenisSusu && jenisSusu.data ? jenisSusu.data : [];

  let schemaFields = {
    tanggal: Yup.string().required("Input tidak boleh kosong"),
  };

  let initValues = {
    tanggal: today,
  };

  preparedData.forEach((res) => {
    const jenis_susu = res.jenis_susu.toLowerCase();
    const jumlah_jenis_susu = `jumlah_paket_${res.jenis_susu.toLowerCase()}`;
    const liter_jenis_susu = `liter_${res.jenis_susu.toLowerCase()}`;
    schemaFields = {
      ...schemaFields,
      [jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
      [jumlah_jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
      [liter_jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
    };
    initValues = {
      ...initValues,
      [jenis_susu]: res.id,
      [jumlah_jenis_susu]: 0,
      [liter_jenis_susu]: 0,
    };
  });

  const Schema = Yup.object().shape(schemaFields);

  // const optionJenisSusu =
  //   data && data.data
  //     ? data.data.map((opt, index) => {
  //         return (
  //           <option key={index} value={opt.id}>
  //             {opt.jenis_susu}
  //           </option>
  //         );
  //       })
  //     : "";

  let inputValues = {};

  let inputData = (val) => {
    preparedData.forEach((res) => {
      const jenis_susu = res.jenis_susu.toLowerCase();
      const jumlah_jenis_susu = `jumlah_paket_${res.jenis_susu.toLowerCase()}`;
      schemaFields = {
        ...schemaFields,
        [jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
        [jumlah_jenis_susu]: Yup.number().required("Input tidak boleh kosong"),
      };
      inputValues = {
        ...inputValues,
        tanggal: val.tanggal,
        [jenis_susu]: res.id,
        [jumlah_jenis_susu]: val[jumlah_jenis_susu],
      };
    });

    return inputValues;
  };

  const createProduksiSusu = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const res = await instance.post("/susu/produksi", body, config);
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
    initialValues: initValues,
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      await createProduksiSusu(inputData(values));
      resetForm({});
      setSubmitting(false);
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
  } = formik;

  const option = preparedData.map((res) => {
    const jumlah_jenis_susu = `jumlah_paket_${res.jenis_susu.toLowerCase()}`;
    const liter_jenis_susu = `liter_${res.jenis_susu.toLowerCase()}`;
    return (
      <Box mt="5" key={res.id}>
        <Box display="flex" key={res.id} mt="2" alignItems="center">
          <Text fontWeight="700" textTransform="uppercase" w="75%">
            {res.jenis_susu}
          </Text>
          <Field name={jumlah_jenis_susu}>
            {({ field, form }) => (
              <FormControl
                id={jumlah_jenis_susu}
                isInvalid={Boolean(
                  touched[jumlah_jenis_susu] && errors[jumlah_jenis_susu]
                )}
              >
                <FormLabel>Jumlah Produksi</FormLabel>
                <InputGroup>
                  <NumberInput
                    defaultValue={0}
                    min={0}
                    {...field}
                    onChange={(val) => form.setFieldValue(field.name, val)}
                    name={jumlah_jenis_susu}
                  >
                    <NumberInputField
                      {...getFieldProps(jumlah_jenis_susu)}
                      onBlur={handleBlur}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <InputRightAddon children="paket" />
                </InputGroup>
                <FormErrorMessage>
                  {touched[jumlah_jenis_susu] && errors[jumlah_jenis_susu]}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <FormControl
            id={liter_jenis_susu}
            ml="3"
            isInvalid={Boolean(
              touched[liter_jenis_susu] && errors[liter_jenis_susu]
            )}
          >
            <FormLabel>Liter</FormLabel>
            <InputGroup>
              <Input
                type="text"
                name={liter_jenis_susu}
                {...getFieldProps(liter_jenis_susu)}
                onBlur={handleBlur}
                disabled={true}
                value={values[jumlah_jenis_susu] * 0.125}
              />
              <InputRightAddon children="liter" />
            </InputGroup>
            <FormErrorMessage>
              {touched[liter_jenis_susu] && errors[liter_jenis_susu]}
            </FormErrorMessage>
          </FormControl>
        </Box>
      </Box>
    );
  });

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
            <Box>{option}</Box>
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

export default FormProduksiSusu;
