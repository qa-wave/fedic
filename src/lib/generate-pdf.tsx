import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { FlexiFakturaVydana } from "./flexi-types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  header: { marginBottom: 30 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { color: "#666" },
  value: { fontWeight: "bold" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#eee", marginVertical: 15 },
  amount: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#999" },
});

function InvoiceDocument({ faktura }: { faktura: FlexiFakturaVydana }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Faktura {faktura.kod}</Text>
          <Text style={styles.subtitle}>Fedic Finance Group s.r.o.</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Odběratel</Text>
          <Text style={styles.value}>{faktura.firmaObj?.nazev || faktura.firma}</Text>
        </View>
        {faktura.firmaObj?.ic && (
          <View style={styles.row}>
            <Text style={styles.label}>IČ</Text>
            <Text style={styles.value}>{faktura.firmaObj.ic}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Datum vystavení</Text>
          <Text style={styles.value}>{faktura.datVyst}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Datum splatnosti</Text>
          <Text style={styles.value}>{faktura.datSplat}</Text>
        </View>
        {faktura.varSym && (
          <View style={styles.row}>
            <Text style={styles.label}>Variabilní symbol</Text>
            <Text style={styles.value}>{faktura.varSym}</Text>
          </View>
        )}
        {faktura.popis && (
          <View style={styles.row}>
            <Text style={styles.label}>Popis</Text>
            <Text style={styles.value}>{faktura.popis}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.amount}>
          Celkem: {new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(faktura.sumCelkem)}
        </Text>

        <View style={styles.footer}>
          <Text>Fedic Finance Group s.r.o. | IČ: 12345678 | info@fedicfinance.com</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoicePDF(faktura: FlexiFakturaVydana): Promise<Blob> {
  const doc = <InvoiceDocument faktura={faktura} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}
