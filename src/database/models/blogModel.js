module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define("blog", {
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

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    schoolDomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Blog;
};
