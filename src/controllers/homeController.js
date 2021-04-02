require("dotenv").config();
import homeService from "./../services/homeService";
import specializationService from "./../services/specializationService";
import merchantService from "./../services/merchantService";
import userService from "./../services/userService";
import supporterService from "./../services/supporterService";
import elasticService from "./../services/syncsElaticService";
import customerService from "./../services/customerService";
import moment from "moment";
// striptags to remove HTML
import striptags from "striptags";

import multer from "multer";

let LIMIT_POST = 5;

const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;

let getHomePage = async (req, res) => {
    try {
        let specializations = await homeService.getSpecializations();
        
        let merchants = await userService.getInfoMerchants();
        let posts = await homeService.getPosts(LIMIT_POST);
        return res.render("main/homepage/homepage.ejs", {
            user: req.user,
            specializations: specializations,
            merchants: merchants,
            posts: posts,
            pageId: process.env.PAGE_ID
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getUserPage = (req, res) => {
    let currentMonth = new Date().getMonth() +1 ;
    res.render("main/users/home.ejs", {
        user: req.user,
        currentMonth: currentMonth
    });
};

let getDetailSpecializationPage = async (req, res) => {
    try {
        let object = await specializationService.getSpecializationById(req.params.id);
        // using date to get schedule of merchants
        let currentDate = moment().format('DD/MM/YYYY');
        let merchants = await merchantService.getMerchantsForSpecialization(req.params.id, currentDate);
        let sevenDaySchedule = [];
        for (let i = 0; i < 5; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let listSpecializations = await specializationService.getAllSpecializations();
        return res.render("main/homepage/specialization.ejs", {
            specialization: object.specialization,
            post: object.post,
            merchants: merchants,
            places: object.places,
            sevenDaySchedule: sevenDaySchedule,
            listSpecializations: listSpecializations
        });

    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getDetailMerchantPage = async (req, res) => {
    try {
        let currentDate = moment().format('DD/MM/YYYY');
        let sevenDaySchedule = [];
        for (let i = 0; i < 5; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let object = await merchantService.getMerchantWithSchedule(req.params.id, currentDate);

        let places = await merchantService.getPlacesForMerchant();
        let postMerchant = await merchantService.getPostForMerchant(req.params.id);


        return res.render("main/homepage/merchant.ejs", {
            merchant: object.merchant,
            sevenDaySchedule: sevenDaySchedule,
            postMerchant: postMerchant,
            specialization: object.specialization,
            places: places
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getBookingPage = (req, res) => {
    res.render("main/homepage/bookingPage.ejs")
};


let getDetailPostPage = async (req, res) => {
    try {
        let post = await supporterService.getDetailPostPage(req.params.id);
        res.render("main/homepage/post.ejs", {
            post: post
        })
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};



let getContactPage = (req, res) => {
    return res.render('main/homepage/contact.ejs');
};

let getPostsWithPagination = async (req, res) => {
    let role = 'nope';
    let object = await supporterService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
    return res.render("main/homepage/allPostsPagination.ejs", {
        posts: object.posts,
        total: object.total,
        striptags: striptags
    })
};

let getPostSearch = async (req, res) => {
    let search = req.query.keyword;
    let results = await elasticService.findPostsByTerm(search);
    return res.render('main/homepage/searchPost.ejs', {
        search: search,
        posts: results.hits.hits
    });
};

let getInfoBookingPage = async (req, res) => {
    try {
        let customerId = req.params.id;
        let customer = await customerService.getInfoBooking(customerId);
        return res.render('main/homepage/infoBooking.ejs', {
            customer: customer
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let postBookingMerchantPageWithoutFiles = async (req, res) => {
    try {
        let item = req.body;
        item.statusId = statusNewId;
        item.historyBreath = req.body.breath;
        item.moreInfo = req.body.extraOldForms;
        if (item.places === 'none') item.placeId = 0;
        item.placeId = item.places;
        item.createdAt = Date.now();

        let customer = await customerService.createNewCustomer(item);
        return res.status(200).json({
            status: 1,
            message: 'success',
            customer: customer
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postBookingMerchantPageNormal = (req, res) => {
    imageImageOldForms(req, res, async (err) => {
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

            let item = req.body;
            let imageOldForm = req.files;
            let image = {};
            imageOldForm.forEach((x, index) => {
                image[index] = x.filename;
            });

            item.statusId = statusNewId;
            item.historyBreath = req.body.breath;
            item.moreInfo = req.body.extraOldForms;
            if (item.places === 'none') item.placeId = 0;
            item.placeId = item.places;
            item.oldForms = JSON.stringify(image);
            item.createdAt = Date.now();

            let customer = await customerService.createNewCustomer(item);
            return res.status(200).json({
                status: 1,
                message: 'success',
                customer: customer
            })

        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageImageOldForms = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/customers");
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

let imageImageOldForms = multer({
    storage: storageImageOldForms,
    limits: { fileSize: 1048576 * 20 }
}).array("oldForms");

let getDetailCustomerBooking = async (req, res) => {
    try {
        let customer = await customerService.getDetailCustomer(req.body.customerId);
        return res.status(200).json(customer);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getFeedbackPage = async (req, res) => {
    try {
        let merchant = await merchantService.getMerchantForFeedbackPage(req.params.id);
        return res.render("main/homepage/feedback.ejs", {
            merchant: merchant
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let postCreateFeedback = async (req, res) => {
    try {
        let feedback = await merchantService.createFeedback(req.body.data);
        return res.status(200).json({
            message: "send feedback success",
            feedback: feedback
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getPageForCustomers = (req, res) => {
    return res.render("main/homepage/forCustomers.ejs");
};

let getPageForMerchants = (req, res) => {
    return res.render("main/homepage/forMerchants.ejs");
};

let postSearchHomePage = async (req, res) => {
    try {
        let result = await homeService.postSearchHomePage(req.body.keyword);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};



let getPageAllMerchants = async (req, res)=>{
    try{
        let merchants = await homeService.getDataPageAllMerchants();
        return res.render("main/homepage/allMerchants.ejs",{
            merchants: merchants
        })
    }catch (e) {
        console.log(e);
    }
};

let getPageAllSpecializations =async (req, res)=>{
    try{
        let specializations = await homeService.getDataPageAllSpecializations();
        return res.render("main/homepage/allSpecializations.ejs",{
            specializations: specializations
        })
    }catch (e) {
        console.log(e);
    }
};


module.exports = {
    getHomePage: getHomePage,
    getUserPage: getUserPage,
    getDetailSpecializationPage: getDetailSpecializationPage,
    getDetailMerchantPage: getDetailMerchantPage,
    getBookingPage: getBookingPage,
    getDetailPostPage: getDetailPostPage,
    getContactPage: getContactPage,
    getPostsWithPagination: getPostsWithPagination,
    getPostSearch: getPostSearch,
    getInfoBookingPage: getInfoBookingPage,
    postBookingMerchantPageWithoutFiles: postBookingMerchantPageWithoutFiles,
    postBookingMerchantPageNormal: postBookingMerchantPageNormal,
    getDetailCustomerBooking: getDetailCustomerBooking,
    getFeedbackPage: getFeedbackPage,
    postCreateFeedback: postCreateFeedback,
    getPageForCustomers: getPageForCustomers,
    getPageForMerchants: getPageForMerchants,
    postSearchHomePage: postSearchHomePage,
    getPageAllMerchants: getPageAllMerchants,
    getPageAllSpecializations: getPageAllSpecializations
};
