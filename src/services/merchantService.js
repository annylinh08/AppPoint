import db from "../models";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from "moment";
import customerService from "./customerService";
import mailer from "../config/mailer";
import { transMailRemedy } from "../../lang/en";

var Minizip = require('minizip-asm.js');
var fs = require("fs");
const PATH_ZIP = "src/public/images/customers/remedy/zip";
let maxBooking = 2;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;
const statusDone = 5;

let getMerchantWithSchedule = (id, currentDate) => {
    return new Promise((async (resolve, reject) => {
        //select with condition: chọn ngày hiện tại mà tổng đặt đang nhỏ hơn max
        try {
            let merchant = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: [ 'password' ]
                },
                include: [
                    {
                        model: db.Schedule, required: false,
                        where: {
                            date: currentDate,
                            sumBooking: { [Op.lt]: maxBooking }
                        }
                    }, {
                        model: db.Merchant_User, attributes: [ 'specializationId' ]
                    },
                    {
                        model: db.Comment,
                        where: { status: true },
                        attributes: [ 'id', 'timeBooking', 'dateBooking', 'name', 'content', 'createdAt', 'status' ],
                        required: false
                    }
                ]
            });

            if (!merchant) {
                reject(`Can't get merchant with id = ${id}`);
            }

            let specializationId = merchant.Merchant_User.specializationId;
            let specialization = await getSpecializationById(specializationId);
           

            let date = new Date();
            let currentHour = `${date.getHours()}:${date.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

            merchant.Schedules.forEach((schedule, index) => {
                let startTime = schedule.time.split('-')[0];
                let timeSchedule = moment(`${schedule.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                schedule.setDataValue('isDisable', timeNow > timeSchedule);

            });


            resolve({
                merchant: merchant,
                specialization: specialization,
            });
        } catch (e) {
            reject(e);
        }
    }));
};

let getPostForMerchant = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { forMerchantId: id },
                order: [ [ 'createdAt', 'DESC' ] ],
                attributes: [ 'id', 'title', 'contentHTML' ]
            });
            resolve(post);
        } catch (e) {
            reject(e);
        }
    }));
};

let postCreateSchedule = (user, arrSchedule, maxBooking) => {
    return new Promise((async (resolve, reject) => {
        try {
            let schedule = await Promise.all(arrSchedule.map(async (schedule) => {
                await db.Schedule.create({
                    'merchantId': user.id,
                    'date': schedule.date,
                    'time': schedule.time,
                    'maxBooking': maxBooking,
                    'sumBooking': 0,
                    'createdAt': Date.now()
                })
            }));
            resolve(schedule);
        } catch (err) {
            reject(err);
        }
    }));
};

let createCustomer = (item) => {
    return new Promise((async (resolve, reject) => {
        try {
            let customer = await db.Customer.create(item);

            resolve(customer);
        } catch (e) {
            reject(e);
        }
    }));
};

let getScheduleMerchantByDate = (id, date) => {
    return new Promise((async (resolve, reject) => {
        try {
            let schedule = await db.Schedule.findAll({
                where: {
                    merchantId: id, date: date, sumBooking: { [Op.lt]: maxBooking }
                }
            });
            let merchant = await getMerchantById(id);

            let dateNow = new Date();
            let currentDate = moment().format('DD/MM/YYYY');
            let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

            schedule.forEach((sch, index) => {
                let startTime = sch.time.split('-')[0];
                let timeSchedule = moment(`${sch.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                sch.setDataValue('isDisable', timeNow > timeSchedule);

            });

            resolve({
                schedule: schedule,
                merchant: merchant
            });
        } catch (e) {
            reject(e);
        }
    }));
};

let getMerchantById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchant = await db.User.findOne({
                where: { id: id, roleId: 2 }
            });
            resolve(merchant);
        } catch (e) {
            reject(e);
        }
    });
};

let getSpecializationById = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let specialization = await db.Specialization.findOne({ where: { id: id } });
            resolve(specialization);
        } catch (e) {
            reject(e);
        }
    }));
};

let getMerchantsForSpecialization = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchants = await db.Merchant_User.findAll({
                where: { specializationId: id },
                attributes: [ 'specializationId' ],
                include: {
                    model: db.User,
                    attributes: [ 'id', 'name', 'avatar', 'address', 'description' ]
                }
            });

            //get schedule each merchant
            await Promise.all(merchants.map(async (merchant) => {
                let schedule = await db.Schedule.findAll({
                    where: {
                        merchantId: merchant.User.id, date: date, sumBooking: { [Op.lt]: maxBooking }
                    },
                    attributes: [ 'id', 'date', 'time' ]
                });


                let dateNow = new Date();
                let currentDate = moment().format('DD/MM/YYYY');
                let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
                let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

                schedule.forEach((sch, index) => {
                    let startTime = sch.time.split('-')[0];
                    let timeSchedule = moment(`${sch.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                    //isDisable nếu time hiện tại > time kế hoạch
                    sch.setDataValue('isDisable', timeNow > timeSchedule);

                });


                merchant.setDataValue('schedule', schedule);
            }));
            resolve(merchants)
        } catch (e) {
            reject(e);
        }
    });
};

let getInfoMerchantById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchant = await db.User.findOne({
                where: { id: id },
                attributes: [ 'id', 'name', 'avatar', 'address', 'phone', 'description' ],
                include: {
                    model: db.Merchant_User,
                    attributes: [ 'specializationId' ]
                }
            });

            let specialization = await db.Specialization.findOne({
                where: { id: merchant.Merchant_User.specializationId }, attributes: [ 'name' ]
            });


            merchant.setDataValue('specializationName', specialization.name);
            resolve(merchant);
        } catch (e) {
            reject(e);
        }
    });
};

let deleteMerchantById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: { id: id }
            });

            let merchant = await db.Merchant_User.findOne({
                where: { merchantId: id }
            });
            if (merchant) {
                await db.Merchant_User.destroy({ where: { id: merchant.id } });
            }

            resolve('delete successful')
        } catch (e) {
            reject(e);
        }
    });
};

let getMerchantForEditPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchant = await db.User.findOne({
                where: { id: id },
                include: {
                    model: db.Merchant_User,

                }
            });
            resolve(merchant)
        } catch (e) {
            reject(e);
        }
    });
};

let updateMerchantInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchant = await db.User.findOne({
                where: { id: data.id },
                include: { model: db.Merchant_User, required: false }
            });
            await merchant.update(data);
            if (merchant.Merchant_User) {
                await merchant.Merchant_User.update(data);
            } else {
                await db.Merchant_User.create({
                    merchantId: data.id,
                    specializationId: data.specializationId,
                })
            }

            resolve(true)
        } catch (e) {
            reject(e);
        }
    });
};

let getCustomersBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customers = await db.Customer.findAll({
                where: {
                    merchantId: data.merchantId,
                    dateBooking: data.date,
                    statusId: statusSuccessId
                },
                order: [ [ 'updatedAt', 'ASC' ] ],
                attributes: [ 'id', 'name', 'timeBooking', 'description' ]
            });
            resolve(customers);
        } catch (e) {
            reject(e);
        }
    });
};

let getMerchantSchedules = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                where: {
                    merchantId: data.merchantId,
                    date: { [Op.in]: data.threeDaySchedules },
                },
            });
            resolve(schedules)
        } catch (e) {
            reject(e);
        }
    });
};

let getPlacesForMerchant = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let places = await db.Place.findAll({
                attributes: [ 'id', 'name' ]
            });
            resolve(places);
        } catch (e) {
            reject(e);
        }
    })
};


let getMerchantForFeedbackPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchant = await db.User.findOne({
                where: { id: id },
                attributes: [ 'id', 'name', 'avatar' ]
            });
            if (!merchant) {
                reject(`Can't get feedback with merchantId=${id}`);
            }
            resolve(merchant);
        } catch (e) {
            reject(e);
        }
    });
};

let createFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let merchantId = data.merchantId;
            let phone = data.feedbackPhone;
            //check customer

            let customer = await db.Customer.findOne({
                where: {
                    merchantId: merchantId,
                    phone: phone,
                    statusId: statusSuccessId
                },
                attributes: [ 'name', 'timeBooking', 'dateBooking' ]
            });

            if (customer) {
                let feedback = {
                    merchantId: merchantId,
                    name: customer.name,
                    timeBooking: customer.timeBooking,
                    dateBooking: customer.dateBooking,
                    phone: phone,
                    content: data.feedbackContent,
                    createdAt: Date.now()
                };
                let cm = await db.Comment.create(feedback);
                resolve(cm);
            } else {
                resolve('customer not exist')
            }

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getMerchantForFeedbackPage: getMerchantForFeedbackPage,
    getMerchantWithSchedule: getMerchantWithSchedule,
    postCreateSchedule: postCreateSchedule,
    createCustomer: createCustomer,
    getPostForMerchant: getPostForMerchant,
    getScheduleMerchantByDate: getScheduleMerchantByDate,
    getMerchantsForSpecialization: getMerchantsForSpecialization,
    getInfoMerchantById: getInfoMerchantById,
    deleteMerchantById: deleteMerchantById,
    getMerchantForEditPage: getMerchantForEditPage,
    updateMerchantInfo: updateMerchantInfo,
    getCustomersBookAppointment: getCustomersBookAppointment,
    getMerchantSchedules: getMerchantSchedules,
    getPlacesForMerchant: getPlacesForMerchant,
    createFeedback: createFeedback,
};