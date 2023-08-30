import React, { useState } from "react";

export default function Ppt() {
  const [pptText, setPptText] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("upload-ppt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server responded with ${response.status}: ${text}`);
      }

      const data = await response.json();
      setPptText(data.text);
    } catch (error) {
      console.error("Error uploading or processing the PPT:", error);
    }
  };

  return (
    <div>
      <h2>Upload PPT</h2>
      <input type="file" onChange={handleFileChange} accept=".pptx" />
      <div>
        <h3>Extracted Text:</h3>
        <p>{pptText}</p>
      </div>
    </div>
  );
}
