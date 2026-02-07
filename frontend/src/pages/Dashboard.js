import React from "react";
import UploadForm from "../components/UploadForm";

export default function Dashboard({ logout }) {
  return (
    <div>
      <h2>Certificate Verification Dashboard</h2>
      <button onClick={logout} style={{ float: "right" }}>Logout</button>
      <UploadForm />
    </div>
  );
}
