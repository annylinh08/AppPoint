'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        avatar: DataTypes.STRING,
        description: DataTypes.TEXT,
        roleId: DataTypes.INTEGER,
        isActive: DataTypes.TINYINT(1),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    User.associate = function(models) {
        models.User.belongsTo(models.Role, { foreignKey: 'roleId' });
        models.User.hasOne(models.Post);
        models.User.hasOne(models.Merchant_User, { foreignKey: 'merchantId' });
        models.User.hasMany(models.Customer, { foreignKey: 'merchantId' });
        models.User.hasMany(models.Schedule, { foreignKey: 'merchantId' });
        models.User.hasMany(models.Comment, { foreignKey: 'merchantId' });
    };

    return User;
};