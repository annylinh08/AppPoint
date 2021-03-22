'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Places', [
            {
                name: 'Toronto',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Aurora',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Barrie',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'New Market',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Texas',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Places', null, {});
    }
};
