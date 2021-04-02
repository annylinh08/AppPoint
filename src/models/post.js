'use strict';
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        title: DataTypes.STRING,
        contentMarkdown: DataTypes.TEXT,
        contentHTML:DataTypes.TEXT,
        forMerchantId: DataTypes.INTEGER,
        forSpecializationId: DataTypes.INTEGER,
        writerId: DataTypes.INTEGER,
        confirmByMerchant: DataTypes.STRING,
        image: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    }, {});
    Post.associate = function(models) {
        models.Post.belongsTo(models.User, { foreignKey: 'forMerchantId' });
        models.Post.belongsTo(models.Specialization, { foreignKey: 'forSpecializationId' });
    };
    return Post;
};