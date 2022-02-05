import { Icon } from "@iconify/react";
const dashboard = "majesticons:dashboard";
const profile = "vs:profile";
const milk = "si-glyph:botl-milk";
const box = "bx:bx-box";
const milking = "whh:milk";
const goat = "emojione-monotone:goat";
const product = "icon-park-outline:ad-product";
const stock = "healthicons:rdt-result-out-stock";
const sell = "whh:resellerhosting";
const list = "clarity:list-solid-badged";
const salary = "fa-solid:money-bill-wave";
const borrow = "codicon:save-as";
const bag = "clarity:coin-bag-solid";
const sellcast = "la:sellcast";
const graph = "uis:graph-bar";
const expenditure = "icon-park-outline:expenses";
const barrel = "mdi:barrel";
const getIcon = (icon) => <Icon icon={icon} width={22} height={22} />;

const general = [
  {
    text: "beranda",
    to: "/dashboard/home",
    icon: getIcon(dashboard),
  },
  {
    text: "profil",
    to: "/dashboard/profile",
    icon: getIcon(profile),
  },
  {
    text: "grafik",
    to: "/dashboard/grafik",
    icon: getIcon(graph),
  },
];

const pegawai = [
  {
    text: "daftar",
    to: "/dashboard/daftar-pegawai",
    icon: getIcon(list),
  },
  {
    text: "pinjaman",
    to: "/dashboard/pinjaman-pegawai",
    icon: getIcon(borrow),
  },
  {
    text: "gaji",
    to: "/dashboard/gaji-pegawai",
    icon: getIcon(salary),
  },
];

const operational = [
  {
    text: "perahan susu",
    to: "/dashboard/perahan_susu",
    icon: getIcon(milk),
  },
  {
    text: "produksi",
    to: "/dashboard/produksi",
    icon: getIcon(product),
  },
  {
    text: "pemasukan",
    to: "/dashboard/pemasukan",
    icon: getIcon(sell),
  },
  {
    text: "pengeluaran",
    to: "/dashboard/pengeluaran",
    icon: getIcon(expenditure),
  },
  {
    text: "kambing",
    to: "/dashboard/kambing",
    icon: getIcon(goat),
  },
];

const pupuk = [
  {
    text: "stock",
    to: "/dashboard/stock_pupuk",
    icon: getIcon(bag),
  },
  {
    text: "penjualan",
    to: "/dashboard/penjualan_pupuk",
    icon: getIcon(sellcast),
  },
];

const report = [
  {
    text: "perahan",
    to: "/dashboard/report_perahan",
    icon: getIcon(barrel),
  },
  {
    text: "produksi",
    to: "/dashboard/report_produksi",
    icon: getIcon(product),
  },
  {
    text: "stock",
    to: "/dashboard/report_stock",
    icon: getIcon(stock),
  },
  {
    text: "pemasukan",
    to: "/dashboard/report_pemasukan",
    icon: getIcon(sell),
  },
  {
    text: "pengeluaran",
    to: "/dashboard/report_pengeluaran",
    icon: getIcon(expenditure),
  },
  {
    text: "kambing",
    to: "/dashboard/report_kambing",
    icon: getIcon(goat),
  },
];

export { general, report, operational };
