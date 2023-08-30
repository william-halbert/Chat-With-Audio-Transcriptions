import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Pdf() {
  const [pdfText, setPdfText] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("pdf", file);

        const response = await fetch("/upload-pdf", {
          // Make sure this endpoint matches your server's
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.text) {
          setPdfText(data.text);
        } else {
          console.error("Failed to extract text:", data.error);
        }
      } catch (error) {
        console.error("Error sending file to server:", error);
      }
    },
  });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Drag & drop a PDF here, or click to select one</p>
      </div>
      <div style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>{pdfText}</div>
    </div>
  );
}

const dropzoneStyles = {
  border: "2px dashed gray",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};
