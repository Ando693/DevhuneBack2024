module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {

        id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        }

    });

    return User;
}