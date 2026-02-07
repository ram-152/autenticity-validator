import React, { useState } from "react";
import API from "../api";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!file) return alert("Please select a certificate file.");

    const formData = new FormData();
    formData.append("certificate", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await API.post("/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Certificate</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={verify}>Verify</button>

      {loading && <p>Verifying... Please wait.</p>}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor:
              result.status === "VALID"
                ? "#d4edda"
                : "#f8d7da",
            color:
              result.status === "VALID"
                ? "#155724"
                : "#721c24",
          }}
        >
          <h4>Status: {result.status}</h4>
          <p>{result.message}</p>

          {result.extracted && (
            <>
              <h5>Extracted Data:</h5>
              <p>Certificate ID: {result.extracted.certificateId}</p>
              <p>Roll Number: {result.extracted.rollNumber}</p>
              <p>Name: {result.extracted.studentName}</p>
            </>
          )}

          {result.record && (
            <>
              <h5>Verified Record:</h5>
              <p>Name: {result.record.studentName}</p>
              <p>Roll No: {result.record.rollNumber}</p>
              <p>Certificate ID: {result.record.certificateId}</p>
              <p>Course: {result.record.course}</p>
              <p>Institute: {result.record.institute}</p>
              <p>Year: {result.record.year}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
