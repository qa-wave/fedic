import type { FlexiFakturaVydana, FlexiFakturaPrijata, FlexiAdresar, FlexiBanka } from "./flexi-types";

export const mockFakturyVydane: FlexiFakturaVydana[] = [
  { id: 1, kod: "FV-2024/001", datVyst: "2024-03-01", datSplat: "2024-03-15", firma: "code:ABC", firmaObj: { nazev: "ABC Systems s.r.o.", ic: "12345678" }, sumCelkem: 125000, zbpiStav: "stavUhr.uhrazeno", stavUhrK: "stavUhr.uhrazeno", typDokl: "code:FAKTURA", varSym: "2024001", popis: "Implementace ERP systému" },
  { id: 2, kod: "FV-2024/002", datVyst: "2024-03-05", datSplat: "2024-03-19", firma: "code:XYZ", firmaObj: { nazev: "XYZ Trading a.s.", ic: "87654321" }, sumCelkem: 45600, zbpiStav: "stavUhr.castUhr", stavUhrK: "stavUhr.castUhr", typDokl: "code:FAKTURA", varSym: "2024002", popis: "Vedení účetnictví 03/2024" },
  { id: 3, kod: "FV-2024/003", datVyst: "2024-03-10", datSplat: "2024-03-24", firma: "code:DEF", firmaObj: { nazev: "DEF Consulting s.r.o.", ic: "11223344" }, sumCelkem: 78900, zbpiStav: "stavUhr.neuhrazeno", stavUhrK: "stavUhr.neuhrazeno", typDokl: "code:FAKTURA", varSym: "2024003", popis: "Daňové poradenství Q1" },
  { id: 4, kod: "FV-2024/004", datVyst: "2024-03-12", datSplat: "2024-03-26", firma: "code:GHI", firmaObj: { nazev: "GHI Manufacturing s.r.o.", ic: "55667788" }, sumCelkem: 234500, zbpiStav: "stavUhr.uhrazeno", stavUhrK: "stavUhr.uhrazeno", typDokl: "code:FAKTURA", varSym: "2024004", popis: "Implementace skladového systému" },
  { id: 5, kod: "FV-2024/005", datVyst: "2024-03-15", datSplat: "2024-03-29", firma: "code:JKL", firmaObj: { nazev: "JKL Services s.r.o.", ic: "99887766" }, sumCelkem: 18700, zbpiStav: "stavUhr.neuhrazeno", stavUhrK: "stavUhr.neuhrazeno", typDokl: "code:FAKTURA", varSym: "2024005", popis: "Mzdové účetnictví 03/2024" },
  { id: 6, kod: "FV-2024/006", datVyst: "2024-03-18", datSplat: "2024-04-01", firma: "code:MNO", firmaObj: { nazev: "MNO Digital a.s.", ic: "33445566" }, sumCelkem: 67800, zbpiStav: "stavUhr.uhrazeno", stavUhrK: "stavUhr.uhrazeno", typDokl: "code:FAKTURA", varSym: "2024006", popis: "Optimalizace cash-flow" },
  { id: 7, kod: "FV-2024/007", datVyst: "2024-03-20", datSplat: "2024-04-03", firma: "code:PQR", firmaObj: { nazev: "PQR Logistics s.r.o.", ic: "77889900" }, sumCelkem: 156200, zbpiStav: "stavUhr.castUhr", stavUhrK: "stavUhr.castUhr", typDokl: "code:FAKTURA", varSym: "2024007", popis: "Vedení účetnictví + daně" },
  { id: 8, kod: "FV-2024/008", datVyst: "2024-03-22", datSplat: "2024-04-05", firma: "code:STU", firmaObj: { nazev: "STU Gastro s.r.o.", ic: "44556677" }, sumCelkem: 32100, zbpiStav: "stavUhr.neuhrazeno", stavUhrK: "stavUhr.neuhrazeno", typDokl: "code:FAKTURA", varSym: "2024008", popis: "Daňová evidence 03/2024" },
];

export const mockFakturyPrijate: FlexiFakturaPrijata[] = [
  { id: 101, kod: "FP-2024/001", datVyst: "2024-03-02", datSplat: "2024-03-16", firma: "code:SUP1", firmaObj: { nazev: "Office Supplies s.r.o." }, sumCelkem: 4560, zbpiStav: "stavUhr.uhrazeno", stavUhrK: "stavUhr.uhrazeno", typDokl: "code:FAKTURA", varSym: "900001", popis: "Kancelářské potřeby" },
  { id: 102, kod: "FP-2024/002", datVyst: "2024-03-08", datSplat: "2024-03-22", firma: "code:SUP2", firmaObj: { nazev: "Cloud Hosting a.s." }, sumCelkem: 12800, zbpiStav: "stavUhr.uhrazeno", stavUhrK: "stavUhr.uhrazeno", typDokl: "code:FAKTURA", varSym: "900002", popis: "Hosting servery 03/2024" },
  { id: 103, kod: "FP-2024/003", datVyst: "2024-03-14", datSplat: "2024-03-28", firma: "code:SUP3", firmaObj: { nazev: "Právní kancelář Novák" }, sumCelkem: 35000, zbpiStav: "stavUhr.neuhrazeno", stavUhrK: "stavUhr.neuhrazeno", typDokl: "code:FAKTURA", varSym: "900003", popis: "Právní služby Q1" },
  { id: 104, kod: "FP-2024/004", datVyst: "2024-03-19", datSplat: "2024-04-02", firma: "code:SUP4", firmaObj: { nazev: "Telekom Czech a.s." }, sumCelkem: 2890, zbpiStav: "stavUhr.neuhrazeno", stavUhrK: "stavUhr.neuhrazeno", typDokl: "code:FAKTURA", varSym: "900004", popis: "Telekomunikace 03/2024" },
];

export const mockAdresar: FlexiAdresar[] = [
  { id: 1, kod: "ABC", nazev: "ABC Systems s.r.o.", ic: "12345678", dic: "CZ12345678", ulice: "Václavské nám. 1", mesto: "Praha", psc: "11000", email: "info@abc.cz", tel: "+420 111 222 333" },
  { id: 2, kod: "XYZ", nazev: "XYZ Trading a.s.", ic: "87654321", dic: "CZ87654321", ulice: "Masarykova 15", mesto: "Brno", psc: "60200", email: "office@xyz.cz", tel: "+420 222 333 444" },
  { id: 3, kod: "DEF", nazev: "DEF Consulting s.r.o.", ic: "11223344", dic: "CZ11223344", ulice: "Národní 8", mesto: "Praha", psc: "11000", email: "info@def.cz", tel: "+420 333 444 555" },
  { id: 4, kod: "GHI", nazev: "GHI Manufacturing s.r.o.", ic: "55667788", dic: "CZ55667788", ulice: "Průmyslová 22", mesto: "Ostrava", psc: "70200", email: "info@ghi.cz", tel: "+420 444 555 666" },
  { id: 5, kod: "JKL", nazev: "JKL Services s.r.o.", ic: "99887766", dic: "CZ99887766", ulice: "Lidická 45", mesto: "Most", psc: "43401", email: "info@jkl.cz", tel: "+420 555 666 777" },
  { id: 6, kod: "MNO", nazev: "MNO Digital a.s.", ic: "33445566", dic: "CZ33445566", ulice: "Technická 3", mesto: "Praha", psc: "16000", email: "hello@mno.cz", tel: "+420 666 777 888" },
];

export const mockBanka: FlexiBanka[] = [
  { id: 1, kod: "BV-2024/001", datVyst: "2024-03-01", sumCelkem: 125000, firma: "code:ABC", popis: "Úhrada FV-2024/001", typPohybuK: "typPohybu.prijem", sparpiSym: "2024001" },
  { id: 2, kod: "BV-2024/002", datVyst: "2024-03-05", sumCelkem: -4560, firma: "code:SUP1", popis: "Úhrada FP-2024/001", typPohybuK: "typPohybu.vydej", sparpiSym: "900001" },
  { id: 3, kod: "BV-2024/003", datVyst: "2024-03-10", sumCelkem: 234500, firma: "code:GHI", popis: "Úhrada FV-2024/004", typPohybuK: "typPohybu.prijem", sparpiSym: "2024004" },
  { id: 4, kod: "BV-2024/004", datVyst: "2024-03-12", sumCelkem: -12800, firma: "code:SUP2", popis: "Úhrada FP-2024/002", typPohybuK: "typPohybu.vydej", sparpiSym: "900002" },
  { id: 5, kod: "BV-2024/005", datVyst: "2024-03-15", sumCelkem: 67800, firma: "code:MNO", popis: "Úhrada FV-2024/006", typPohybuK: "typPohybu.prijem", sparpiSym: "2024006" },
  { id: 6, kod: "BV-2024/006", datVyst: "2024-03-18", sumCelkem: 22800, firma: "code:XYZ", popis: "Částečná úhrada FV-2024/002", typPohybuK: "typPohybu.prijem", sparpiSym: "2024002" },
  { id: 7, kod: "BV-2024/007", datVyst: "2024-03-20", sumCelkem: 78100, firma: "code:PQR", popis: "Částečná úhrada FV-2024/007", typPohybuK: "typPohybu.prijem", sparpiSym: "2024007" },
];

export interface MockPokladniPohyb {
  id: number;
  kod: string;
  datVyst: string;
  sumCelkem: number;
  firma?: string;
  popis: string;
  typPohybuK: string;
  pokladna: string;
}

export const mockPokladna: MockPokladniPohyb[] = [
  { id: 1, kod: "PP-2024/001", datVyst: "2024-03-01", sumCelkem: 1500, firma: "code:ABC", popis: "Drobný nákup kancelářských potřeb", typPohybuK: "typPohybu.vydej", pokladna: "Hlavní pokladna" },
  { id: 2, kod: "PP-2024/002", datVyst: "2024-03-04", sumCelkem: 3200, firma: "code:XYZ", popis: "Hotovostní úhrada faktury", typPohybuK: "typPohybu.prijem", pokladna: "Hlavní pokladna" },
  { id: 3, kod: "PP-2024/003", datVyst: "2024-03-07", sumCelkem: 890, firma: undefined, popis: "Poštovné a kolky", typPohybuK: "typPohybu.vydej", pokladna: "Hlavní pokladna" },
  { id: 4, kod: "PP-2024/004", datVyst: "2024-03-10", sumCelkem: 15000, firma: "code:DEF", popis: "Záloha na služby", typPohybuK: "typPohybu.prijem", pokladna: "Hlavní pokladna" },
  { id: 5, kod: "PP-2024/005", datVyst: "2024-03-12", sumCelkem: 450, firma: undefined, popis: "Občerstvení na poradu", typPohybuK: "typPohybu.vydej", pokladna: "Drobná pokladna" },
  { id: 6, kod: "PP-2024/006", datVyst: "2024-03-14", sumCelkem: 2800, firma: "code:GHI", popis: "Hotovostní tržba", typPohybuK: "typPohybu.prijem", pokladna: "Hlavní pokladna" },
  { id: 7, kod: "PP-2024/007", datVyst: "2024-03-17", sumCelkem: 1200, firma: undefined, popis: "PHM - služební cesta", typPohybuK: "typPohybu.vydej", pokladna: "Drobná pokladna" },
  { id: 8, kod: "PP-2024/008", datVyst: "2024-03-19", sumCelkem: 5600, firma: "code:JKL", popis: "Hotovostní úhrada dobropisu", typPohybuK: "typPohybu.prijem", pokladna: "Hlavní pokladna" },
  { id: 9, kod: "PP-2024/009", datVyst: "2024-03-21", sumCelkem: 350, firma: undefined, popis: "Parkovné", typPohybuK: "typPohybu.vydej", pokladna: "Drobná pokladna" },
  { id: 10, kod: "PP-2024/010", datVyst: "2024-03-23", sumCelkem: 7800, firma: "code:MNO", popis: "Záloha na konzultaci", typPohybuK: "typPohybu.prijem", pokladna: "Hlavní pokladna" },
];

export interface MockDokument {
  id: number;
  nazev: string;
  typ: "smlouva" | "podklad" | "report" | "faktura" | "ostatni";
  velikost: string;
  datum: string;
  nahral: string;
  popis?: string;
}

export const mockDokumenty: MockDokument[] = [
  { id: 1, nazev: "Smlouva_ABC_Systems.pdf", typ: "smlouva", velikost: "2.4 MB", datum: "2024-03-01", nahral: "Radek Fedič", popis: "Rámcová smlouva o vedení účetnictví" },
  { id: 2, nazev: "Podklady_Q1_2024.xlsx", typ: "podklad", velikost: "1.8 MB", datum: "2024-03-05", nahral: "Tomáš Mertin", popis: "Účetní podklady za Q1 2024" },
  { id: 3, nazev: "Danove_priznani_2023.pdf", typ: "report", velikost: "3.1 MB", datum: "2024-03-10", nahral: "Radek Fedič", popis: "Daňové přiznání za rok 2023" },
  { id: 4, nazev: "FV-2024-001_priloha.pdf", typ: "faktura", velikost: "540 KB", datum: "2024-03-12", nahral: "Radek Fedič", popis: "Příloha k faktuře FV-2024/001" },
  { id: 5, nazev: "Plna_moc_2024.pdf", typ: "smlouva", velikost: "890 KB", datum: "2024-03-14", nahral: "Tomáš Mertin", popis: "Plná moc pro zastupování na FÚ" },
  { id: 6, nazev: "Mzdove_vystupy_03.pdf", typ: "report", velikost: "1.2 MB", datum: "2024-03-18", nahral: "Radek Fedič", popis: "Mzdové výstupy za březen 2024" },
  { id: 7, nazev: "Banka_vykaz_03.csv", typ: "podklad", velikost: "320 KB", datum: "2024-03-20", nahral: "Tomáš Mertin", popis: "Bankovní výpis za březen" },
  { id: 8, nazev: "Inventura_2023.xlsx", typ: "report", velikost: "4.5 MB", datum: "2024-03-22", nahral: "Radek Fedič", popis: "Inventarizace majetku 2023" },
  { id: 9, nazev: "Dodatek_smlouvy_XYZ.pdf", typ: "smlouva", velikost: "680 KB", datum: "2024-03-25", nahral: "Tomáš Mertin", popis: "Dodatek ke smlouvě s XYZ Trading" },
  { id: 10, nazev: "Cestovni_prikazy_03.pdf", typ: "ostatni", velikost: "1.5 MB", datum: "2024-03-27", nahral: "Radek Fedič", popis: "Cestovní příkazy za březen" },
];

export function formatCZK(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("cs-CZ");
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "stavUhr.uhrazeno": return "Uhrazeno";
    case "stavUhr.castUhr": return "Částečně";
    case "stavUhr.neuhrazeno": return "Neuhrazeno";
    default: return status;
  }
}

export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "stavUhr.uhrazeno": return "default";
    case "stavUhr.castUhr": return "secondary";
    case "stavUhr.neuhrazeno": return "destructive";
    default: return "outline";
  }
}
