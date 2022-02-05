/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React, { useState, useEffect, forwardRef, useMemo } from "react";
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
  Text,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import moment from "moment";
import "moment/locale/id";
import InputFilterTable from "../../components/InputFilterTable";
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
import instance from "../../axios.default";

const TableProduksiSusu = () => {
  const toast = useToast();
  const [query, setQuery] = useState(`/susu/produksi/report`);
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [ids, setIds] = useState("");
  const [jenisSusu, setJenisSusu] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const openAndSetIds = (val) => {
    onOpen();
    setIds(val);
  };

  const fetchReportProduksiSusu = async (query) => {
    try {
      const report = await instance.get(query);
      const jenis_susu = await instance.get(`/jenis_susu`);
      setReport(report.data);
      setJenisSusu(jenis_susu.data);
      setLoading(true);
    } catch (error) {
      alert("ALLO");
    }
  };

  useEffect(() => {
    fetchReportProduksiSusu(query);
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
    { names: "No", selector: "no", width: "10%" },
    { names: "Tanggal", selector: "tanggal" },
    { names: "Jenis Susu", selector: "jenis_susu_id" },
    { names: "Jumlah Produksi", selector: "jumlah_paket" },
    { names: "Jumlah Liter", selector: "jumlah_liter" },
    { names: "Aksi", selector: "action", center: true },
  ];

  const buttonSettings = [
    {
      name: "Bulan Lalu",
      query: "/susu/produksi/report?search=prev_month",
    },
    { name: "Bulan Ini", query: "/susu/produksi/report" },
    { name: "Hari ini", query: "/susu/produksi/report?search=today" },
    {
      name: "Minggu ini",
      query: "/susu/produksi/report?search=this_week",
    },
    {
      name: "Semua",
      query: "/susu/produksi/report?search=all",
    },
  ];

  const onClickToSetQuery = (q, id) => {
    setQuery(q);
    setActive([id]);
    setLoading(false);
  };

  const subHeaderComponentMemo = useMemo(() => {
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
            jenis_susu_id:
              res.jenis_susu && res.jenis_susu.jenis_susu
                ? res.jenis_susu.jenis_susu
                : undefined,
            jumlah_paket: res.jumlah_paket + " paket",
            jumlah_liter: res.jumlah_liter + " liter",
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

  let totalJumlahProduksi = filteredItems.reduce(
    (sum, item) =>
      sum + parseInt(item.jumlah_paket.replace("paket", "").trim()),
    0
  );

  let totalJumlahProduksiLiter = filteredItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.jumlah_liter.replace("paket", "").trim()),
    0
  );

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
      `/susu/produksi/report?search=custom&year=${year}&month=${month}&date=${date}`
    );
    setActive([5]);
    setLoading(false);
  };

  const dataReady = report && report.data ? report.data : [];
  const dataFiltered = dataReady.filter((val) => {
    return val.id === ids;
  });

  let initValues = {};

  dataFiltered.map(async (res) => {
    return (initValues = {
      tanggal: res.tanggal.substr(0, 10),
      jumlah_paket: res.jumlah_paket,
      jumlah_liter: res.jumlah_liter,
      jenis_susu: res.jenis_susu_id,
    });
  });

  const Schema = Yup.object().shape({
    tanggal: Yup.date("Input harus berupa file").required(
      "Input tidak boleh kosong"
    ),
    jenis_susu: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    jumlah_paket: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
    jumlah_liter: Yup.number("Input harus berupa angka").required(
      "Input tidak boleh kosong"
    ),
  });

  const updateProduksiSusu = async (id, values, query) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);

    try {
      const res = await instance.put(
        `/susu/produksi/${id}/update`,
        body,
        config
      );
      setIds("");
      fetchReportProduksiSusu(query);
      toast({
        title: "Update Berhasil",
        status: "success",
        duration: 2000,
        position: "top",
      });
    } catch (error) {
      toast({
        title: !error.response ? "Server Error" : error.response.data.msg,
        description: "Update Gagal!",
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
      await updateProduksiSusu(ids, values, query);
      onClose();
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
  } = formik;

  const jenis = jenisSusu && jenisSusu.data ? jenisSusu.data : [];
  const optionSusu = jenis.map((res, index) => {
    return (
      <option key={index} value={res.id}>
        {res.jenis_susu}
      </option>
    );
  });

  const modalEdit = (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Produksi Susu</ModalHeader>
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
              <FormControl
                mt="3"
                id="jenis_susu"
                isInvalid={Boolean(touched.jenis_susu && errors.jenis_susu)}
              >
                <FormLabel>Jenis Susu</FormLabel>
                <Select
                  type="text"
                  name="jenis_susu"
                  {...getFieldProps("jenis_susu")}
                  onBlur={handleBlur}
                >
                  {optionSusu}
                </Select>
                <FormErrorMessage>
                  {touched.jenis_susu && errors.jenis_susu}
                </FormErrorMessage>
              </FormControl>
              <Box display="flex" mt="3">
                <Field name="jumlah_paket">
                  {({ field, form }) => (
                    <FormControl
                      id="jumlah_paket"
                      isInvalid={Boolean(
                        touched.jumlah_paket && errors.jumlah_paket
                      )}
                    >
                      <FormLabel>Jumlah Produksi</FormLabel>
                      <InputGroup>
                        <NumberInput
                          defaultValue={0}
                          min={0}
                          {...field}
                          onChange={(val) =>
                            form.setFieldValue(field.name, val)
                          }
                          name="jumlah_paket"
                        >
                          <NumberInputField
                            {...getFieldProps("jumlah_paket")}
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
                        {touched.jumlah_paket && errors.jumlah_paket}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <FormControl
                  id="jumlah_liter"
                  ml="3"
                  isInvalid={Boolean(
                    touched.jumlah_liter && errors.jumlah_liter
                  )}
                >
                  <FormLabel>Liter</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="jumlah_liter"
                      {...getFieldProps("jumlah_liter")}
                      onBlur={handleBlur}
                      disabled={true}
                      value={parseInt(values.jumlah_paket) * 0.125}
                    />
                    <InputRightAddon children="liter" />
                  </InputGroup>
                  <FormErrorMessage>
                    {touched.jumlah_liter && errors.jumlah_liter}
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
          Laporan Produksi Susu
        </Heading>
        <Box display="flex" justifyContent="space-between" pt="5" px="5">
          <Skeleton isLoaded={loading}>
            <Box>
              <Text>Total Produksi (paket): {totalJumlahProduksi} paket</Text>
              <Text>
                Total Produksi (liter): {totalJumlahProduksiLiter} liter
              </Text>
            </Box>
          </Skeleton>
          <Button leftIcon={<DownloadIcon />} colorScheme="green" size="md">
            Unduh Laporan
          </Button>
        </Box>
        <Skeleton mt="5" isLoaded={loading}>
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

export default TableProduksiSusu;
