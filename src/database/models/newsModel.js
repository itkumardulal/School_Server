module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define("new", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    imgName: {
      type: DataTypes.STRING,
    },
    imgUrl: {
      type: DataTypes.STRING,
    },
    schoolDomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return News;
};
