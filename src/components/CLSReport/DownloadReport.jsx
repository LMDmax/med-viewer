import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const DownloadReport = ({ report, caseInfo, userInfo }) => {
  const styles = StyleSheet.create({
    page: {
      padding: "10px",
      flexDirection: "column",
      backgroundColor: "white",
      fontSize: "16px",
    },
    table: {
      width: "100%",
      fontSize: "12px",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #000",
      paddingTop: 8,
      paddingBottom: 8,
    },
    header: {
      borderTop: "none",
    },
    bold: {
      fontWeight: "bold",
    },
    row1: {
      width: "105%",
      fontSize: "12px",
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    row2: {
      width: "20%",
      fontSize: "12px",
      padding: "0px",
    },
    row3: {
      width: "35%",
      fontSize: "12px",
      paddingLeft: "10px",
      paddingRight: "10px",
    },
    row4: {
      width: "20%",
      fontSize: "12px",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View>
          <Text style={{ marginTop: "6px", fontSize: "12px" }}>
            {" "}
            Study Name: {caseInfo?.name}
          </Text>
          <Text style={{ marginTop: "6px", fontSize: "12px" }}>
            {" "}
            Aim: {caseInfo?.Aim ? caseInfo?.Aim : "-"}
          </Text>
          <Text
            style={{
              marginTop: "10px",
              fontSize: "12px",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
            }}
          >
            {" "}
            Questionnaire
          </Text>
        </View>
        {report?.map((row, i) => (
          <View key={i} wrap={false} style={{ margin: "8px" }}>
            <Text style={{ fontSize: "12px" }}>{`Q${i + 1} : ${
              row?.questionText
            }`}</Text>
            <Text style={{ fontSize: "12px", marginTop: "4px" }}>
              {`A : ${row?.response
                .replace(/{"/g, "")
                .replace(/"}/g, "")
                .replace(/"/g, "")}`}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default DownloadReport;
