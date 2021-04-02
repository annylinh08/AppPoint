import merchantService from "./../services/merchantService";
import userService from "./../services/userService";
import _ from "lodash";
import moment from "moment";
import multer from "multer";

const MAX_BOOKING = 2;

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

let getSchedule = async (req, res) => {
    try {
        let threeDaySchedules = [];
        for (let i = 0; i < 3; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('DD/MM/YYYY');
            threeDaySchedules.push(date);
        }
        let data = {
            threeDaySchedules: threeDaySchedules,
            merchantId: req.user.id
        };
        let schedules = await merchantService.getMerchantSchedules(data);

        schedules.forEach((x) => {
            x.date = Date.parse(stringToDate(x.date, "dd/MM/yyyy", "/"))
        });

        schedules = _.sortBy(schedules, x => x.date);

        schedules.forEach((x) => {
            x.date = moment(x.date).format("DD/MM/YYYY")
        });

        return res.render("main/users/admins/schedule.ejs", {
            user: req.user,
            schedules: schedules,
            threeDaySchedules: threeDaySchedules
        })
    } catch (e) {
        console.log(e)
    }
};

let getCreateSchedule = (req, res) => {
    return res.render("main/users/admins/createSchedule.ejs", {
        user: req.user
    })
};

let postCreateSchedule = async (req, res) => {
    await merchantService.postCreateSchedule(req.user, req.body.schedule_arr, MAX_BOOKING);
    return res.status(200).json({
        "status": 1,
        "message": 'success'
    })
};

let getScheduleMerchantByDate = async (req, res) => {
    try {
        let object = await merchantService.getScheduleMerchantByDate(req.body.merchantId, req.body.date);
        let data = object.schedule;
        let merchant = object.merchant;
        return res.status(200).json({
            status: 1,
            message: data,
            merchant: merchant
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
};

let getInfoMerchantById = async (req, res) => {
    try {
        let merchant = await merchantService.getInfoMerchantById(req.body.id);
        return res.status(200).json({
            'message': 'success',
            'merchant': merchant
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageAppointment = async (req, res) => {
    // let date = "30/03/2020";
    let currentDate = moment().format('DD/MM/YYYY');
    let canActive = false;
    let date = '';
    if (req.query.dateMerchantAppointment) {
        date = req.query.dateMerchantAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }

    let data = {
        date: date,
        merchantId: req.user.id
    };

    let appointments = await merchantService.getCustomersBookAppointment(data);
    // sort by range time
    let sort = _.sortBy(appointments, x => x.timeBooking);
    //group by range time
    let final = _.groupBy(sort, function(x) {
        return x.timeBooking;
    });

    return res.render("main/users/admins/manageAppointment.ejs", {
        user: req.user,
        appointments: final,
        date: date,
        active: canActive
    })
};

let getManageChart = (req, res) => {
    return res.render("main/users/admins/manageChartMerchant.ejs", {
        user: req.user
    })
};


let postSendFormsToCustomer = (req, res) => {
    FileSendCustomer(req, res, async (err) => {
        if (err) {
            console.log(err);
            if (err.message) {
                console.log(err.message);
                return res.status(500).send(err.message);
            } else {
                console.log(err);
                return res.status(500).send(err);
            }
        }
        try {

            let customer = await merchantService.sendFormsForCustomer(req.body.customerId, req.files);
            return res.status(200).json({
                status: 1,
                message: 'sent files success',
                customer: customer
            })
        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageFormsSendCustomer = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/customers/remedy");
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

let FileSendCustomer = multer({
    storage: storageFormsSendCustomer,
    limits: { fileSize: 1048576 * 20 }
}).array("filesSend");

let postCreateChart = async (req, res) => {
    try {
        let object = await userService.getInfoMerchantChart(req.body.month);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postAutoCreateAllMerchantsSchedule = async (req, res) => {
    try {
        let data = await userService.createAllMerchantsSchedule();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}


module.exports = {
    getSchedule: getSchedule,
    getCreateSchedule: getCreateSchedule,
    postCreateSchedule: postCreateSchedule,
    getScheduleMerchantByDate: getScheduleMerchantByDate,
    getInfoMerchantById: getInfoMerchantById,
    getManageAppointment: getManageAppointment,
    getManageChart: getManageChart,
    postSendFormsToCustomer: postSendFormsToCustomer,
    postCreateChart: postCreateChart,
    postAutoCreateAllMerchantsSchedule: postAutoCreateAllMerchantsSchedule
};
