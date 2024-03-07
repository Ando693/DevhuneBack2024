module.exports = (sequelize, DataTypes) => {
  const Map = sequelize.define("Map", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
      primaryKey: true,
      autoIncrement: true,
    },
    Map_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { notEmpty: true },
    },
    Longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { notEmpty: true },
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Map;
};
