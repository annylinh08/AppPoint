import bcrypt from "bcryptjs";
import db from "./../models";
import helper from "../helper/client";
import elastic from "./../config/elastic";
import _ from "lodash";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import moment from "moment";

let salt = 7;
let createMerchant = (merchant) => {
    merchant.roleId = 2;
    merchant.password = bcrypt.hashSync(merchant.password, salt);
    return new Promise((async (resolve, reject) => {
        let newMerchant = await db.User.create(merchant);
        let item = {
            merchantId: newMerchant.id,
            specializationId: merchant.specializationId
        };
        await db.Merchant_User.create(item);

        //create merchant elastic

        resolve(newMerchant)
    }));
};

let getInfoMerchants = () => {
    return new Promise((async (resolve, reject) => {
        try {
            let merchants = await db.User.findAll({
                where: { roleId: 2 },
                include: [
                    { model: db.Merchant_User, required: false },
                    { model: db.Customer, required: false, where: { statusId: 1 } }
                ]
            });
            await Promise.all(merchants.map(async (merchant) => {
                if (merchant.Merchant_User) {
                    let specialization = await helper.getSpecializationById(merchant.Merchant_User.specializationId);
                    let countBooking = merchant.Customers.length;
                    merchant.setDataValue('specializationName', specialization.name);
                    merchant.setDataValue('countBooking', countBooking);
                } else {
                    merchant.setDataValue('specializationName', "null");
                    merchant.setDataValue('countBooking', 0);
                }
                return merchant;
            }));
            resolve(merchants);
        } catch (e) {
            reject(e);
        }

    }));
};

let findUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
};

let comparePassword = (password, user) => {
    return bcrypt.compare(password, user.password);
};

let findUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                attributes: [ 'id', 'name', 'avatar', 'roleId', 'isActive' ]
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    });
};

function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);

}

let getInfoStatistical = (month) => {
    return new Promise(async (resolve, reject) => {
        try {
            let startDate = Date.parse(stringToDate(`01/${month}/2020`, "dd/MM/yyyy", "/"));
            let endDate = Date.parse(stringToDate(`31/${month}/2020`, "dd/MM/yyyy", "/"));

            let customers = await db.Customer.findAndCountAll({
                attributes: [ 'id','merchantId' ],
                where: {
                    createdAt: {
                        [Op.between]: [ startDate, endDate ],
                    },
                }
            });

            let merchants = await db.User.findAndCountAll({
                attributes: [ 'id' ],
                where: {
                    roleId: 2,
                    createdAt: {
                        [Op.between]: [ startDate, endDate ],
                    }
                }
            });

            let posts = await db.Post.findAndCountAll({
                attributes: [ 'id','writerId' ],
                where: {
                    forSpecializationId: -1,
                    forMerchantId: -1,
                    createdAt: {
                        [Op.between]: [ startDate, endDate ],
                    }
                }
            });

            let bestMerchant = '';

            if(+customers.count > 0){
                let bestMerchantIdArr = _(customers.rows)
                .groupBy('merchantId')
                .map((v, merchantId) => ({
                    merchantId,
                    customerId: _.map(v, 'id')
                }))
                .value();
                let merchantObject = _.maxBy(bestMerchantIdArr, function(o) {
                    return o.customerId.length;
                });
                 bestMerchant = await db.User.findOne({
                    where: {
                        id: merchantObject.merchantId
                    },
                    attributes: ['id', 'name']
                });
                bestMerchant.setDataValue("count", merchantObject.customerId.length);
            }

            let bestSupporter = '';
            if(+posts.count > 0){
                let bestSupporterIdArr = _(posts.rows)
                .groupBy('writerId')
                .map((v, writerId) => ({
                    writerId,
                    postId: _.map(v, 'id')
                }))
                .value();
                let supporterObject = _.maxBy(bestSupporterIdArr, function(o) {
                    return o.postId.length;
                });
                 bestSupporter = await db.User.findOne({
                    where: {
                        id: supporterObject.writerId
                    },
                    attributes: ['id', 'name']
                });
                bestSupporter.setDataValue("count", supporterObject.postId.length);
            }

            resolve({
                customers: customers,
                merchants: merchants,
                posts: posts,
                bestMerchant: bestMerchant,
                bestSupporter: bestSupporter
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getInfoMerchantChart = (month) => {
    return new Promise(async (resolve, reject) => {
        try{
            let startDate = Date.parse(stringToDate(`01/${month}/2020`, "dd/MM/yyyy", "/"));
            let endDate = Date.parse(stringToDate(`31/${month}/2020`, "dd/MM/yyyy", "/"));
            let customers = await db.Customer.findAndCountAll({
                attributes: [ 'id','merchantId','statusId' ],
                where: {
                    createdAt: {
                        [Op.between]: [ startDate, endDate ],
                    },
                }
            });
            resolve({customers: customers})
        }catch (e) {
            reject(e);
        }
    });
};

let createAllMerchantsSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let timeArr = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
                '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
            ]
            let threeDaySchedules = [];
            for (let i = 0; i < 3; i++) {
                let date = moment(new Date()).add(i, 'days').locale('en').format('DD/MM/YYYY');
                threeDaySchedules.push(date);
            }

            let merchants = await db.User.findAll({
                where: {
                    roleId: 2
                },
                attributes: ['id', 'name'],
                raw: true
            });

            //only create once
            let isCreatedBefore = false;

            //only check the first merchant with date and time
            let check = await db.Schedule.findAll({
                where: {
                    merchantId: merchants[0].id,
                    date: threeDaySchedules[0],
                    time: timeArr[0]
                }
            })

            if(check && check.length > 0) isCreatedBefore = true;

            if(!isCreatedBefore){
                if (merchants && merchants.length > 0) {
                    await Promise.all(
                        merchants.map((merchant) => {
                            threeDaySchedules.map(day => {
                                timeArr.map(async (time) => {
                                    let schedule = {
                                        merchantId: merchant.id,
                                        date: day,
                                        time: time,
                                        maxBooking: 2,
                                        sumBooking: 0
                                    }
                                    await db.Schedule.create(schedule);
                                })
                            })
                        })
                    )
                }
                resolve("Appointments are created successful (in 3 days). Please check your database (schedule table)")
            }else {
                resolve("Appointments are duplicated. Please check your database (schedule table)")
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllMerchantsSchedule = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                attributes: ['merchantId', 'date', 'time'],
                raw: true
            });
            resolve(schedules)
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createMerchant: createMerchant,
    getInfoMerchants: getInfoMerchants,
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    comparePassword: comparePassword,
    getInfoStatistical: getInfoStatistical,
    getInfoMerchantChart: getInfoMerchantChart,
    createAllMerchantsSchedule: createAllMerchantsSchedule,
    getAllMerchantsSchedule: getAllMerchantsSchedule
};
