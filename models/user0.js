module.exports = (sequelize, DataTypes) => {

    const User0 = sequelize.define('User0', {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
            primaryKey: true 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        }

    });

    return User0;
}