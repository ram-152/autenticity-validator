const mongoose = require("mongoose");


const CertificateSchema = new mongoose.Schema({
studentName: String,
rollNumber: String,
course: String,
institution: String,
certificateId: String,
issueDate: String,
isValid: { type: Boolean, default: true },
});


module.exports = mongoose.model("Certificate", CertificateSchema);