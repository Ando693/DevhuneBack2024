module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    });
  
    return Message;
  };