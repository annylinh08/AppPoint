'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Specializations', [
            {
                name: 'Nails',
                image: 'nail.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hair',
                image: 'hair.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Massage',
                image: 'massage.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Clinic',
                image: 'clinic.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Eyelash',
                image: 'eyelash.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Transplant Hepatology',
                image: 'dental.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ], {});

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Specializations', null, {});
    }
};
