import db from "./../models";
import mailer from "./../config/mailer";
import { transMailBookingNew, transMailBookingSuccess, transMailBookingFailed } from "../../lang/en";
import helper from "../helper/client";


const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;

let getInfoBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: { id: id },
                attributes: [ 'id', 'merchantId' ]
            });

            if (!customer) {
                reject(`Can't get customer with id = ${id}`);
            }
            let merchant = await db.User.findOne({
                where: { id: customer.merchantId },
                attributes: [ 'name', 'avatar' ]
            });

            customer.setDataValue('merchantName', merchant.name);
            customer.setDataValue('merchantAvatar', merchant.avatar);
            resolve(customer);
        } catch (e) {
            reject(e);
        }
    });
};

let getForCustomersTabs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let newCustomers = await db.Customer.findAll({
                where: {
                    statusId: statusNewId
                },
                order: [ [ 'updatedAt', 'DESC' ] ],
            });

            let pendingCustomers = await db.Customer.findAll({
                where: {
                    statusId: statusPendingId
                },
                order: [ [ 'updatedAt', 'DESC' ] ],
            });

            let confirmedCustomers = await db.Customer.findAll({
                where: {
                    statusId: statusSuccessId
                },
                order: [ [ 'updatedAt', 'DESC' ] ],
            });

            let canceledCustomers = await db.Customer.findAll({
                where: {
                    statusId: statusFailedId
                },
                order: [ [ 'updatedAt', 'DESC' ] ],
            });

            resolve({
                newCustomers: newCustomers,
                pendingCustomers: pendingCustomers,
                confirmedCustomers: confirmedCustomers,
                canceledCustomers: canceledCustomers
            });
        } catch (e) {
            reject(e);
        }
    });
};

let changeStatusCustomer = (data, logs) => {
    return new Promise(async (resolve, reject) => {
        try {

            let customer = await db.Customer.findOne({
                where: { id: data.id }
            });

            let merchant = await db.User.findOne({
                where: { id: customer.merchantId },
                attributes: [ 'name', 'avatar' ],
            });

            if (data.statusId === statusSuccessId) {
                let schedule = await db.Schedule.findOne({
                    where: { merchantId: customer.merchantId, time: customer.timeBooking, date: customer.dateBooking }
                });

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum + 1 });
            }

            if (data.statusId === statusFailedId) {
                let schedule = await db.Schedule.findOne({
                    where: { merchantId: customer.merchantId, time: customer.timeBooking, date: customer.dateBooking }
                });

                let sum = +schedule.sumBooking;
                await schedule.update({ sumBooking: sum - 1 });
            }


            await customer.update(data);

            //update logs
            let log = await db.SupporterLog.create(logs);

            //send email
            if (data.statusId === statusSuccessId) {
                let dataSend = {
                    time: customer.timeBooking,
                    date: customer.dateBooking,
                    merchant: merchant.name
                };
                await mailer.sendEmailNormal(customer.email, transMailBookingSuccess.subject, transMailBookingSuccess.template(dataSend));
            }
            if (data.statusId === statusFailedId && customer.email) {
                let dataSend = {
                    time: customer.timeBooking,
                    date: customer.dateBooking,
                    merchant: merchant.name,
                    reason: log.content
                };
                await mailer.sendEmailNormal(customer.email, transMailBookingFailed.subject, transMailBookingFailed.template(dataSend));
            }

            resolve(customer);
        } catch (e) {
            reject(e);
        }
    });
};

let isBookAble = async (merchantId, date, time) => {
    let schedule = await db.Schedule.findOne({
        where: {
            merchantId: merchantId,
            date: date,
            time: time
        },
        attributes: [ 'id', 'merchantId', 'date', 'time', 'maxBooking', 'sumBooking' ]
    });

    if (schedule) {
        return schedule.sumBooking < schedule.maxBooking;
    }
    return false;
};

let createNewCustomer = (data) => {
    return new Promise((async (resolve, reject) => {
        try {

            let schedule = await db.Schedule.findOne({
                where: {
                    merchantId: data.merchantId,
                    date: data.dateBooking,
                    time: data.timeBooking
                },
            }).then(async (schedule) => {
                if (schedule && schedule.sumBooking < schedule.maxBooking) {
                    let customer = await db.Customer.create(data);
                    data.customerId = customer.id;
                    await db.ExtraInfo.create(data);
                    
                    //tăng sumBooking
                    let sum = +schedule.sumBooking;
                    await schedule.update({ sumBooking: sum + 1 });

                    let merchant = await db.User.findOne({
                        where: { id: customer.merchantId },
                        attributes: [ 'name', 'avatar' ]
                    });

                    //update logs
                    let logs = {
                        customerId: customer.id,
                        content: "The customer made an appointment from the system ",
                        createdAt: Date.now()
                    };

                    await db.SupporterLog.create(logs);

                    let dataSend = {
                        time: customer.timeBooking,
                        date: customer.dateBooking,
                        merchant: merchant.name
                    };

                    let isEmailSend = await mailer.sendEmailNormal(customer.email, transMailBookingNew.subject, transMailBookingNew.template(dataSend));
                    if (!isEmailSend) {
                        console.log("An error occurs when sending an email to: " + customer.email);
                        console.log(isEmailSend);
                    }

                    resolve(customer);
                } else {
                    resolve("Max booking")
                }

            });

        } catch (e) {
            reject(e);
        }
    }));
};

let getDetailCustomer = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.Customer.findOne({
                where: { id: id },
                include: { model: db.ExtraInfo, required: false }
            });
            resolve(customer)
        } catch (e) {
            reject(e);
        }
    });
};

let getLogsCustomer = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let logs = await db.SupporterLog.findAll({
                where: {
                    customerId: id
                }
            });

            if (logs.length) {
                await Promise.all(logs.map(async (log) => {
                    if (log.supporterId) {
                        let supporter = await db.User.findOne({
                            where: { id: log.supporterId },
                            attributes: [ 'name' ]
                        });
                        log.setDataValue('supporterName', supporter.name);
                    } else {
                        log.setDataValue('supporterName', '');
                    }
                    return log;
                }));
            }
            resolve(logs);
        } catch (e) {
            reject(e);
        }
    });
};

let getComments = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let comments = await db.Comment.findAll({
                where: {
                    status: false
                }
            });
            resolve(comments);

        } catch (e) {
            reject(e)
        }
    });
};
module.exports = {
    getInfoBooking: getInfoBooking,
    getForCustomersTabs: getForCustomersTabs,
    changeStatusCustomer: changeStatusCustomer,
    createNewCustomer: createNewCustomer,
    getDetailCustomer: getDetailCustomer,
    getLogsCustomer: getLogsCustomer,
    getComments: getComments
};
