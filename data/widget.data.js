import { Icon } from "@iconify/react";

const milk = "icon-park:milk";
const sell = "flat-ui:money";
const money = "fa-solid:money-bill";
const milking = "icon-park:milk-one";
const bag = "clarity:coin-bag-solid";
const stock = "healthicons:rdt-result-out-stock";
const goat = "emojione:goat";
const result = "carbon:result-new";
const animal = "healthicons:animal-donkey";

const getIcon = (color, icon, width, height) => (
  <Icon color={color} icon={icon} width={width} height={height} />
);

const numToIdr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const dataWidget = (
  hasil_perahan,
  produksi_susu_liter,
  produksi_susu,
  produksi_pupuk,
  stock_susu_liter,
  stock_susu,
  stock_pupuk,
  penjualan_susu,
  penjualan_susu_hasil,
  penjualan_pupuk,
  penjualan_pupuk_hasil,
  total,
  total_hasil,
  jantan,
  betina,
  anakan,
  jumlah_kambing,
  tanggal
) => {
  const dataForWidget = [
    {
      text: "jantan",
      tanggal,
      percentage: "",
      number: `${jantan} ekor`,
      icon: getIcon("var(--chakra-colors-gray-700)", goat, 90, 90),
    },
    {
      text: "betina",
      tanggal,
      percentage: "",
      number: `${betina} ekor`,
      icon: getIcon("var(--chakra-colors-gray-700)", goat, 90, 90),
    },
    {
      text: "anakan",
      tanggal,
      percentage: "",
      number: `${anakan} ekor`,
      icon: getIcon("var(--chakra-colors-gray-700)", goat, 90, 90),
    },
    {
      text: "jumlah kambing",
      tanggal,
      percentage: "",
      number: `${jumlah_kambing} ekor`,
      icon: getIcon("var(--chakra-colors-red-700)", goat, 90, 90),
      gridColumn: "1/4",
    },
    {
      text: "hasil perahan",
      tanggal,
      percentage: "",
      number: `${hasil_perahan} liter`,
      icon: getIcon("var(--chakra-colors-green-700)", result, 90, 90),
      gridColumn: "1/4",
    },
    {
      text: "produksi susu",
      tanggal,
      percentage: `${produksi_susu_liter} liter`,
      number: `${produksi_susu} paket`,
      icon: getIcon("var(--chakra-colors-gray-700)", milking, 90, 90),
    },
    {
      text: "penjualan susu",
      tanggal,
      percentage: `${penjualan_susu} paket`,
      number: numToIdr.format(penjualan_susu_hasil),
      icon: getIcon("var(--chakra-colors-green-500)", money, 90, 90),
    },
    {
      text: "stock susu",
      tanggal,
      percentage: `${stock_susu_liter} liter`,
      number: `${stock_susu} paket`,
      icon: getIcon("var(--chakra-colors-gray-900)", milk, 90, 90),
    },
    {
      text: "produksi pupuk",
      tanggal,
      percentage: "",
      number: `${produksi_pupuk} karung`,
      icon: getIcon("var(--chakra-colors-red-900)", bag, 90, 90),
    },
    {
      text: "penjualan pupuk",
      tanggal,
      percentage: `${penjualan_pupuk} karung`,
      number: numToIdr.format(penjualan_pupuk_hasil),
      icon: getIcon("var(--chakra-colors-green-500)", money, 90, 90),
    },
    {
      text: "stock pupuk",
      tanggal,
      percentage: "",
      number: `${stock_pupuk} karung`,
      icon: getIcon("var(--chakra-colors-red-500)", stock, 90, 90),
    },
    {
      text: "total penjualan",
      tanggal,
      percentage: `${total} paket`,
      number: numToIdr.format(total_hasil),
      icon: getIcon("var(--chakra-colors-green-500)", sell, 90, 90),
      gridColumn: "1/4",
    },
  ];

  return dataForWidget;
};

export default dataWidget;
