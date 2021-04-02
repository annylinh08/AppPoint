'use strict';
module.exports = (sequelize, DataTypes) => {
    const ExtraInfo = sequelize.define('ExtraInfo', {
        customerId: DataTypes.INTEGER,
        historyBreath: DataTypes.TEXT,
        placeId: DataTypes.INTEGER,
        oldForms: DataTypes.TEXT,
        sendForms: DataTypes.TEXT,
        moreInfo: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    ExtraInfo.associate = function(models) {
        models.ExtraInfo.belongsTo(models.Customer, { foreignKey: 'customerId' });
        models.ExtraInfo.belongsTo(models.Place, { foreignKey: 'placeId' });
    };
    return ExtraInfo;
};
