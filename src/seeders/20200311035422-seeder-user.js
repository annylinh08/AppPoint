'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'admin - App-point',
                email: 'linhduong2399@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Toronto',
                phone: '088456732',
                avatar: 'admin.png',
                roleId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hardrock Nails',
                email: 'johny@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '790 Broadview Ave, Toronto, ON M4K 2P7',
                phone: '088456735',
                avatar: 'johnny.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Beauty Divine',
                email: 'linhduong231999@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '2391 Bloor St W, Toronto, ON M6S 1P6',
                phone: '088456735',
                avatar: 'kelly.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hand & Stone',
                email: 'jasmin@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '130 Live Eight Way, Barrie, ON L4N 6P1',
                phone: '088456735',
                avatar: 'jasmin.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Eye Loves Lashes',
                email: 'jenn@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '151 Essa Rd, Barrie, ON L4N 3L2',
                phone: '088456735',
                avatar: 'jenn.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'New Market Dental',
                email: 'sam@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '17906 Yonge St #2, Newmarket, ON L3Y 8S1',
                phone: '088456735',
                avatar: 'doctor4.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Envy Hair',
                email: 'ben@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: '241 Essa Rd #2, Barrie, ON L4N 6B7',
                phone: '088456735',
                avatar: 'doctor1.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Supporter - Tim',
                email: 'supporter@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Toronto',
                phone: '088456736',
                avatar: 'supporter.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
