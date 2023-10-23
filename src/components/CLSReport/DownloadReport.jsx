import React from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { AiFillPrinter } from "react-icons/ai";
import jsPDF from "jspdf";
import { GrDownload } from "react-icons/gr";

const DownloadReport = ({ report, caseInfo, userInfo }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const checkPageHeight = (currentY, lineHeight, doc) => {
      const pageHeight = doc.internal.pageSize.height;
      return currentY + lineHeight < pageHeight;
    };
    let yPosition = 15;
    doc.text(`Slide Title: ${report?.slide_title ?report?.slide_title :"-"}`,10,yPosition);
    yPosition +=10

    report?.finalQuestionnaireResponse?.forEach((row, i) => {
        doc.text(`Q${i + 1} : ${row?.question_text ||row?.section_heading}`,10,yPosition,{maxWidth:190});
        const textSize = doc.splitTextToSize(row?.question_text || row?.section_heading, 190);
        const dim = doc.getTextDimensions(row?.question_text || row?.section_heading).h;
        yPosition += textSize.length * dim+3.5;
        row?.section_questions?.length &&
          row?.section_questions?.forEach((question, i) => {
            if (!checkPageHeight(yPosition, 10, doc)) {
              doc.addPage();
              yPosition = 10;
            }
            doc.text(`Q${i + 1} : ${question?.question_text}`, 15, yPosition, {
              maxWidth: 190,
            });
            const textSize = doc.splitTextToSize(question?.question_text, 190);
            const dim = doc.getTextDimensions(question?.question_text).h;
            yPosition += textSize.length * dim + 3;
            if (!checkPageHeight(yPosition, 10, doc)) {
              doc.addPage();
              yPosition = 10;
            }
            doc.text(
              `  A : ${question?.response
                ?.replace(/{"/g, "")
                .replace(/"}/g, "")
                .replace(/"/g, "")}`,
              15,
              yPosition,
              { maxWidth: 190 }
            );
            yPosition += 6;
          });
         if (!checkPageHeight(yPosition, 10, doc)) {
           doc.addPage();
           yPosition = 10;
         }
         !row?.section_questions?.length && doc.text(
          `A : ${row?.response
            ?.replace(/{"/g, "")
            ?.replace(/"}/g, "")
            ?.replace(/"/g, "")}`,10,yPosition,{maxWidth:190});
            const responseSize = doc.splitTextToSize(`${row.response
              ?.replace(/{"/g, "")
              .replace(/"}/g, "")
              .replace(/"/g, "")}`, 190);
            const responseDim = doc.getTextDimensions(`${row.response
              ?.replace(/{"/g, "")
              .replace(/"}/g, "")
              .replace(/"/g, "")}`).h;
            yPosition += responseSize.length * responseDim +5;
          }
         )
         if (!checkPageHeight(yPosition, 10, doc)) {
          doc.addPage();
          yPosition = 10;
        }
         doc.addImage(report?.signature_file, "JPEG", 10, yPosition, 30, 18);
         yPosition += 23;
         doc.setTextColor(59, 93, 124);
         if (!checkPageHeight(yPosition, 10, doc)) {
           doc.addPage();
           yPosition = 10;
         }
         doc.text(`${report?.first_name} ${report?.last_name}`, 10, yPosition);
         doc.setTextColor(0, 0, 0);
         yPosition += 5;
         if (!checkPageHeight(yPosition, 10, doc)) {
          doc.addPage();
          yPosition = 10;
        }
         doc.text(`${report?.highest_qualification}`, 10, yPosition);
         yPosition += 5;
         if (!checkPageHeight(yPosition, 10, doc)) {
          doc.addPage();
          yPosition = 10;
        }
         doc.text(`${report?.Institute}`, 10, yPosition);
    const pdfName = `slide_report`;
    doc.save(pdfName);
  };
  return (
    <Button
    leftIcon={<GrDownload />}
    size="sm"
    fontWeight="400"
    borderRadius="0px"
    _active={{ outline: "none" }}
    _focus={{ outline: "none" }}
    bg="#fff"
    _hover={{ bg: "#fff" }}
    onClick={generatePDF}

  >
    Download
  </Button>
  );
};

export default DownloadReport;
