const { admissions } = require("../database/connection");

const addAdmission = async (req, res) => {
  const {
    fullName,
    gradeApplyingFor,
    dob,
    gender,
    guardianName,
    phoneNumber,
    emailAddress,
    Address,
    previousSchool,
    additionalInformation,
    schoolDomain
  } = req.body;
  if (
    !fullName ||
    !gradeApplyingFor ||
    !dob ||
    !gender ||
    !guardianName ||
    !phoneNumber ||
    !emailAddress ||
    !Address
  ) {
    return res.status(400).json({
      message: "please provide all the information of required input field",
    });
  }
 
  await admissions.create({
    fullName,
    gradeApplyingFor,
    dob,
    gender,
    guardianName,
    phoneNumber,
    emailAddress,
    Address,
    schoolDomain,
    previousSchool,
    additionalInformation
  });
  return res.status(201).json({
    message: "admission form filled successfully",
  });
};

const fetchAdmission = async (req, res) => {
  const role = req.userRole;
  const user = req.user;

  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins are allowed to access messages." });
  }

  if (!user || !user.schoolDomain) {
    return res
      .status(403)
      .json({ message: "Missing school domain for this admin." });
  }

  const data = await admissions.findAll({
    where: { schoolDomain: user.schoolDomain },
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({
    message: "admission fetch successfully",
    data,
  });
};

const deleteAdmission = async (req, res) => {
  const { id } = req.params;
  await admissions.destroy({
    where: {
      id,
    },
  });
  return res.status(200).json({
    message: "admission data deleted successfully",
  });
};

module.exports = { addAdmission, fetchAdmission, deleteAdmission };
