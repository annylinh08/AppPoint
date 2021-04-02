'use strict';
module.exports = (sequelize, DataTypes) => {
    const Merchant_User = sequelize.define('Merchant_User', {
        merchantId: DataTypes.INTEGER,
        specializationId: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Merchant_User.associate = function(models) {
        models.Merchant_User.belongsTo(models.User, { foreignKey: 'merchantId' });
    };
    return Merchant_User;
};
