module.exports = (sequelize, DataTypes) => {
  const Admission = sequelize.define("admission", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gradeApplyingFor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,

    },

    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guardianName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previousSchool: {
      type: DataTypes.TEXT,
    },
    additionalInformation: {
      type: DataTypes.STRING,
    },
    schoolDomain: {
      type: DataTypes.STRING,
    },
  });
  return Admission;
};
