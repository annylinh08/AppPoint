'use strict';
module.exports = (sequelize, DataTypes) => {
    const SupporterLog = sequelize.define('SupporterLog', {
        supporterId: DataTypes.INTEGER,
        Id: DataTypes.INTEGER,
        content: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    SupporterLog.associate = function(models) {
        models.SupporterLog.belongsTo(models.Customer, { foreignKey: 'customerId' });
        models.SupporterLog.belongsTo(models.User, { foreignKey: 'supporterId' });
    };
    return SupporterLog;
};
