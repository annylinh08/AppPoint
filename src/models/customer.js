'use strict';
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        merchantId: DataTypes.INTEGER,
        statusId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        dateBooking: DataTypes.STRING,
        timeBooking: DataTypes.STRING,
        email: DataTypes.STRING,
        address: DataTypes.TEXT,
        description: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Customer.associate = function(models) {
        models.Customer.belongsTo(models.User, { foreignKey: 'merchantId' });
        models.Customer.belongsTo(models.Status, { foreignKey: 'statusId' });
        models.Customer.hasOne(models.ExtraInfo);
        models.Customer.hasMany(models.SupporterLog);
    };
    return Customer;
};
