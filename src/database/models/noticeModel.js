module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define("notice", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:true
    },
    title: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    pdfName: {
      type: DataTypes.STRING,
    },
    pdfUrl: {
      type: DataTypes.STRING,
    },
       schoolDomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Notice;
};
