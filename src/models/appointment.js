'use strict';
module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        merchantId: DataTypes.INTEGER,
        customerId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        time: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    Appointment.associate = function(models) {

    };
    return Appointment;
};