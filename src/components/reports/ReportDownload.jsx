import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReportPreview from "./ReportPreview";

export default function ReportDownload({ data, title, period }) {
  const previewRef = useRef();

  const downloadPDF = () => {
    const input = document.getElementById("report-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title || "LivingRockCMS_Report"}.pdf`);
    });
  };

  return (
    <div>
      <button
        onClick={downloadPDF}
        style={{
          backgroundColor: "#22223b",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Download PDF
      </button>
      <div style={{ background: "#f8f9fa", padding: 24, borderRadius: 8 }}>
        <ReportPreview data={data} title={title} period={period} />
      </div>
    </div>
  );
} 