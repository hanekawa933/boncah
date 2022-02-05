/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  Button,
  Heading,
  useDisclosure,
  useToast,
  Skeleton,
  Text,
  Image,
  Select,
  FormLabel,
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
import instance from "../axios.default";

const TableKambing = () => {
  const toast = useToast();
  const [query, setQuery] = useState(
    `/kambing/query?kandang=Semua&status=Semua&jenis=Semua`
  );
  const [active, setActive] = useState([1]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [ids, setIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOther, setLoadingOther] = useState(false);
  const [kambing, setKambing] = useState([]);
  const [kambingNeeds, setKambingNeeds] = useState([]);
  const [jenis, setJenis] = useState("Semua");
  const [kandang, setKandang] = useState("Semua");
  const [status, setStatus] = useState("Semua");

  const fetchReportKambing = async (query) => {
    try {
      const res = await instance.get(query);
      setKambing(res.data.extracted);
      setLoading(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  const fetchAllKambingNeeds = async () => {
    try {
      const res = await instance.get("/kambing/kandang");
      setKambingNeeds(res.data.data);
      setLoadingOther(true);
    } catch (error) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchReportKambing(query);
    fetchAllKambingNeeds();
  }, [query]);

  const jenisKambing =
    kambingNeeds && kambingNeeds.jenis_kambing
      ? [{ id: 999, jenis_kambing: "Semua" }, ...kambingNeeds.jenis_kambing]
      : [];
  const statusKambing =
    kambingNeeds && kambingNeeds.status_kambing
      ? [{ id: 999, status: "Semua" }, ...kambingNeeds.status_kambing]
      : [];
  const kandangKambing =
    kambingNeeds && kambingNeeds.kandang_kambing
      ? [{ id: 999, kandang: "Semua" }, ...kambingNeeds.kandang_kambing]
      : [];

  const jenisKambingOption = jenisKambing.map((res) => {
    return (
      <option key={res.id} value={res.jenis_kambing}>
        {res.jenis_kambing}
      </option>
    );
  });

  const kandangKambingOption = kandangKambing.map((res) => {
    return (
      <option key={res.id} value={res.id}>
        {res.kandang}
      </option>
    );
  });

  const statusKambingOption = statusKambing.map((res) => {
    return (
      <option key={res.id} value={res.status}>
        {res.status}
      </option>
    );
  });

  const columnNames = [
    { names: "No", selector: "no" },
    { names: "Foto", selector: "foto_kambing" },
    { names: "Kode", selector: "no_kambing" },
    { names: "Kandang", selector: "kandang_kambing" },
    { names: "Jenis", selector: "jenis_kambing" },
    { names: "Status", selector: "status_kambing" },
    { names: "Aksi", selector: "action" },
  ];

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

  const dataTable = kambing
    ? kambing.map((res, index) => {
        return {
          no: index + 1,
          foto_kambing: (
            <Image
              py="2"
              src={"http://localhost:8000" + res.foto}
              alt={`Foto Kambing ${res.no_kambing}`}
            />
          ),
          no_kambing: res.no_kambing,
          kandang_kambing: res.kandang_kambing,
          jenis_kambing: res.jenis_kambing,
          status_kambing: res.status_kambing,
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
      item.no_kambing.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status_kambing.toLowerCase().includes(filterText.toLowerCase()) ||
      item.jenis_kambing.toLowerCase().includes(filterText.toLowerCase()) ||
      item.kandang_kambing.toLowerCase().includes(filterText.toLowerCase())
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

  return (
    <Box>
      <Box display="flex" justifyContent="center"></Box>
      <Box>
        <Heading fontSize="2xl" mt="7">
          Laporan Kambing
        </Heading>
        <Box display="flex" justifyContent="end" pt="5" pr="5">
          <Button leftIcon={<DownloadIcon />} colorScheme="green" size="md">
            Unduh Laporan
          </Button>
        </Box>
        <Skeleton isLoaded={loading}>
          <Box display="flex" justifyContent="center">
            <Box>
              <FormLabel>Jenis</FormLabel>
              <Select
                onChange={(e) => {
                  setJenis(e.target.value);
                  const queryJenis = query.split("&");
                  const findQueryJenis = queryJenis.indexOf(
                    queryJenis[queryJenis.length - 1]
                  );
                  if (findQueryJenis !== -1) {
                    queryJenis[findQueryJenis] = `jenis=${e.target.value}`;
                  }
                  const joined = queryJenis.join("&");
                  setQuery(joined);
                }}
              >
                {jenisKambingOption}
              </Select>
            </Box>
            <Box mx="5">
              <FormLabel>Kandang</FormLabel>
              <Select
                onChange={(e) => {
                  setKandang(e.target.value);
                  const queryKandang = query.split("?");
                  const queryKandang2 = queryKandang[1].split("&");
                  const findQueryKandang = queryKandang2.indexOf(
                    queryKandang2[0]
                  );
                  if (findQueryKandang !== -1) {
                    queryKandang2[
                      findQueryKandang
                    ] = `kandang=${e.target.value}`;
                  }
                  const joined = queryKandang2.join("&");
                  const array = [queryKandang[0], joined];
                  const joined2 = array.join("?");
                  setQuery(joined2);
                }}
              >
                {kandangKambingOption}
              </Select>
            </Box>
            <Box>
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(e) => {
                  setStatus(e.target.value);
                  const queryStatus = query.split("&");
                  const findQueryStatus = queryStatus.indexOf(
                    queryStatus[queryStatus.length - 2]
                  );
                  if (findQueryStatus !== -1) {
                    queryStatus[findQueryStatus] = `status=${e.target.value}`;
                  }
                  console.log(queryStatus[queryStatus.length - 1]);
                  const joined = queryStatus.join("&");
                  setQuery(joined);
                }}
              >
                {statusKambingOption}
              </Select>
            </Box>
          </Box>
        </Skeleton>
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

export default TableKambing;
