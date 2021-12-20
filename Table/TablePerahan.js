/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
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
import DataTable from "react-data-table-component";
import moment from "moment";
import "moment/locale/id";
import InputFilterTable from "../components/InputFilterTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarIcon,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import { useFormik, Form, FormikProvider, Field } from "formik";
import * as Yup from "yup";
import instance from "../axios.default";

const TablePerahan = () => {
  const toast = useToast();
  const [query, setQuery] = useState(`/susu/perahan/report`);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [ids, setIds] = useState("");
  const [report, setReport] = useState([]);
  const [waktu, setWaktu] = useState([]);
  const [keterangan, setKeterangan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOther, setLoadingOther] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const fetchReportHasilPerahan = async (dispatch) => {
    try {
      const res = await instance.get(query);
      setReport(res.data);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  const fetchWaktuDanKeterangan = async () => {
    try {
      const waktu = await instance.get("/susu/waktu");
      setWaktu(waktu.data);
      const keterangan = await instance.get("/susu/keterangan");
      setKeterangan(keterangan.data);
      setLoadingOther(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchReportHasilPerahan(query);
    fetchWaktuDanKeterangan();
  }, [query]);

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      colorScheme="blue"
      onClick={onClick}
      ref={ref}
      size="sm"
      mr="3"
      rightIcon={<CalendarIcon />}
      isActive={active.includes(5)}
    >
      {active.includes(5) ? value : "Pilih Tanggal"}
    </Button>
  ));

  const columnNames = [
    { names: "No", selector: "no" },
    { names: "Hasil Perahan", selector: "hasil_perahan" },
    { names: "Pengurangan Susu", selector: "hasil_berkurang" },
    { names: "Total Perahan", selector: "total_perahan" },
    { names: "Waktu Pemerahan", selector: "waktu_pemerahan_id" },
    { names: "Keterangan Pengurangan", selector: "keterangan_pemerahan_id" },
    { names: "Tanggal", selector: "tanggal" },
    { names: "Aksi", selector: "action", center: true },
  ];

  const buttonSettings = [
    {
      name: "Bulan Lalu",
      query: "/susu/perahan/report?search=prev_month",
    },
    { name: "Bulan Ini", query: "/susu/perahan/report" },
    { name: "Hari ini", query: "/susu/perahan/report?search=today" },
    {
      name: "Minggu ini",
      query: "/susu/perahan/report?search=this_week",
    },
    {
      name: "Semua",
      query: "/susu/perahan/report?search=all",
    },
  ];

  const onClickToSetQuery = (q, id) => {
    setQuery(q);
    setActive([id]);
    setLoading(false);
    setLoadingOther(false);
  };

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <InputFilterTable
        onFilterText={(e) => setFilterText(e.target.value)}
        clearFilter={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const buttonChoice = buttonSettings.map((res, index) => {
    return (
      <Button
        isActive={active.includes(index)}
        key={index}
        colorScheme="blue"
        size="sm"
        mr="3"
        onClick={() => onClickToSetQuery(res.query, index)}
      >
        {res.name}
      </Button>
    );
  });

  const dataTable =
    report && report.data
      ? report.data.map((res, index) => {
          return {
            no: index + 1,
            hasil_perahan: res.hasil_perahan + " liter",
            hasil_berkurang: res.hasil_berkurang + " liter",
            total_perahan: res.total_perahan + " liter",
            waktu_pemerahan_id:
              res.waktu_pemerahan && res.waktu_pemerahan.waktu
                ? res.waktu_pemerahan.waktu
                : undefined,
            keterangan_pemerahan_id:
              res.keterangan_pemerahan && res.keterangan_pemerahan.keterangan
                ? res.keterangan_pemerahan.keterangan
                : undefined,
            tanggal: moment(res.tanggal).format("Do MMMM YYYY"),
            action: (
              <Box display="flex">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  mx="1"
                  size="sm"
                  onClick={() => openAndSetIds(res.id)}
                >
                  <EditIcon />
                </Button>
                <Button colorScheme="red" variant="solid" size="sm">
                  <DeleteIcon />
                </Button>
              </Box>
            ),
          };
        })
      : [];

  const filteredItems = dataTable.filter((item) => {
    if (!filterText) return true;
    if (
      item.jenis_susu_id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jumlah_paket.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jumlah_liter.toLowerCase().includes(filterText.toLowerCase()) ||
      item.tanggal.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return true;
    }
  });

  const columns = columnNames.map((res) => {
    return {
      name: res.names,
      selector: (row) => row[res.selector],
      sortable: true,
      center: res.center,
      width: res.width,
    };
  });

  const handleChangeWhenDateChange = (e) => {
    setStartDate(e);
    const dateObj = new Date(e);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const date = dateObj.getDate();
    setQuery(
      `/susu/perahan/report?search=custom&year=${year}&month=${month}&date=${date}`
    );
    setActive([5]);
    setLoading(false);
    setLoadingOther(false);
  };

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

  const dataReady = report && report.data ? report.data : [];
  const dataFiltered = dataReady.filter((val) => {
    return val.id === ids;
  });

  let initValues = {};

  dataFiltered.map(async (res) => {
    return (initValues = {
      tanggal: res.tanggal.substr(0, 10),
      hasil_perahan: res.hasil_perahan,
      hasil_berkurang: res.hasil_berkurang,
      waktu_pemerahan_id: res.waktu_pemerahan_id,
      keterangan_pemerahan_id: res.keterangan_pemerahan_id,
      keterangan_lainnya: res.keterangan_lainnya,
    });
  });

  const Schema = Yup.object().shape({
    tanggal: Yup.date().required("Input tidak boleh kosong"),
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
  });

  const updateHasilPerahan = async (id, values, query) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);

    try {
      const res = await instance.put(
        `/susu/perahan/${id}/update`,
        body,
        config
      );
      setIds("");
      fetchReportHasilPerahan(query);
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
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      let val = {};

      val =
        values.keterangan_pemerahan_id === "999"
          ? {
              ...values,
              keterangan_pemerahan_id: values.keterangan_lainnya,
            }
          : { keterangan_lainnya, ...values };

      delete val.keterangan_lainnya;
      await updateHasilPerahan(ids, values, query);
      resetForm({});
      onClose();
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

  const modalEdit = (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hasil Perahan</ModalHeader>
        <ModalCloseButton />
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <ModalBody>
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
                          onChange={(val) =>
                            form.setFieldValue(field.name, val)
                          }
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
                          onChange={(val) =>
                            form.setFieldValue(field.name, val)
                          }
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
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Batal
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                Ubah Data
              </Button>
            </ModalFooter>
          </Form>
        </FormikProvider>
      </ModalContent>
    </Modal>
  );

  return (
    <Box>
      <Box>{modalEdit}</Box>
      <Box display="flex" justifyContent="center">
        <Box width={active.includes(5) ? "8rem" : "8.5rem"}>
          <DatePicker
            selected={startDate}
            onChange={(date) => handleChangeWhenDateChange(date)}
            customInput={<ExampleCustomInput />}
          />
        </Box>
        {buttonChoice}
      </Box>
      <Box>
        <Heading fontSize="2xl" mt="7">
          Laporan Hasil Perahan Susu
        </Heading>
        <Box display="flex" justifyContent="end" px="5">
          <Button leftIcon={<DownloadIcon />} colorScheme="green" size="md">
            Unduh Laporan
          </Button>
        </Box>
        <Skeleton isLoaded={loading && loadingOther} mt="5">
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            highlightOnHover
            pointerOnHover
          />
        </Skeleton>
      </Box>
    </Box>
  );
};

export default TablePerahan;
