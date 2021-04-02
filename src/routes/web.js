import express from "express";
import home from "./../controllers/homeController";
import auth from "./../controllers/authController";
import admin from "./../controllers/adminController";
import merchant from "./../controllers/merchantController";
import supporter from "./../controllers/supporterController";
import passport from "passport";
import passportLocal from 'passport-local';
import userService from "./../services/userService";

const multer = require('multer');
const upload = multer();

let router = express.Router();

let LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            await userService.findUserByEmail(email).then(async (user) => {
                if (!user) {
                    return done(null, false, req.flash("error", "Email is not existed"));
                }
                if (user && user.isActive === 1) {
                    let match = await userService.comparePassword(password, user);
                    if (match) {
                        return done(null, user, null)
                    } else {
                        return done(null, false, req.flash("error", "Password is not valid")
                        )
                    }
                }
                if (user && user.isActive === 0) {
                    return done(null, false, req.flash("error", "Account is not activated"));
                }
            });
        } catch (err) {
            console.log(err);
            return done(null, false, { message: err });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

let initRoutes = (app) => {
    router.get("/all-businesses", home.getPageAllMerchants);
    router.get("/all-categories", home.getPageAllSpecializations);

    router.get('/feedback/:id', home.getFeedbackPage);
    router.post('/feedback/create', home.postCreateFeedback);

    router.get('/for-customers', home.getPageForCustomers);
    router.get('/for-merchants', home.getPageForMerchants);

    router.post('/search-homepage', home.postSearchHomePage);

    router.get('/', home.getHomePage);
    router.get('/contact', home.getContactPage);
    router.get('/detail/specialization/:id', home.getDetailSpecializationPage);
    router.get('/detail/merchant/:id', home.getDetailMerchantPage);

    router.post('/booking-merchant-without-files/create', home.postBookingMerchantPageWithoutFiles);
    router.post('/booking-merchant-normal/create', home.postBookingMerchantPageNormal);

    router.get('/detail/post/:id', home.getDetailPostPage);
    router.get('/booking-info/:id', home.getInfoBookingPage);

    router.get('/all-posts', home.getPostsWithPagination);
    router.get('/posts/search/', home.getPostSearch);

    router.get('/users/manage/specialization', auth.checkLoggedIn, admin.getSpecializationPage);
    router.get('/users/manage/supporter', auth.checkLoggedIn, admin.getSupporterPage);
    router.get('/users', auth.checkLoggedIn, home.getUserPage);

    router.get('/users/manage/schedule-for-merchants', auth.checkLoggedIn, admin.getManageCreateScheduleForMerchantsPage);

    router.get('/users/manage/merchant', auth.checkLoggedIn, admin.getManageMerchant);
    router.get('/users/manage/merchant/create', auth.checkLoggedIn, admin.getCreateMerchant);
    router.post('/admin/merchant/create', auth.checkLoggedIn, admin.postCreateMerchant);
    router.get('/users/merchant/edit/:id', auth.checkLoggedIn, admin.getEditMerchant);
    router.put('/admin/merchant/update-without-file', auth.checkLoggedIn, admin.putUpdateMerchantWithoutFile);
    router.put('/admin/merchant/update', auth.checkLoggedIn, admin.putUpdateMerchant);

    router.get('/merchant/manage/schedule', merchant.getSchedule);
    router.get('/merchant/manage/schedule/create', auth.checkLoggedIn, merchant.getCreateSchedule);
    router.post('/merchant/manage/schedule/create', auth.checkLoggedIn, merchant.postCreateSchedule);
    router.post('/merchant/get-schedule-merchant-by-date', merchant.getScheduleMerchantByDate);
    router.get('/merchant/manage/appointment', auth.checkLoggedIn, merchant.getManageAppointment);
    router.get('/merchant/manage/chart', auth.checkLoggedIn, merchant.getManageChart);
    router.post('/merchant/manage/create-chart', auth.checkLoggedIn, merchant.postCreateChart);
    router.post('/merchant/send-forms-to-customer', auth.checkLoggedIn, merchant.postSendFormsToCustomer);
    router.post('/merchant/auto-create-all-merchants-schedule', auth.checkLoggedIn, merchant.postAutoCreateAllMerchantsSchedule)

    router.get('/supporter/manage/customers', auth.checkLoggedIn, supporter.getManageCustomersPage);
    router.get('/supporter/get-new-customers', auth.checkLoggedIn, supporter.getNewCustomers);
    router.get('/supporter/manage/posts', auth.checkLoggedIn, supporter.getManagePosts);
    router.get('/supporter/pagination/posts', supporter.getPostsPagination);
    router.get('/supporter/post/edit/:id', auth.checkLoggedIn, admin.getEditPost);
    router.put('/supporter/post/update', auth.checkLoggedIn, admin.putUpdatePost);
    router.get('/supporter/manage/post/create', auth.checkLoggedIn, supporter.getCreatePost);
    router.post('/supporter/manage/post/create', auth.checkLoggedIn, supporter.postCreatePost);
    router.get('/supporter/get-list-posts', auth.checkLoggedIn, supporter.getAllPosts);
    router.post('/supporter/get-customers-for-tabs', auth.checkLoggedIn, supporter.getForCustomersTabs);
    router.post('/supporter/change-status-customer', auth.checkLoggedIn, supporter.postChangeStatusCustomer);
    router.post('/supporter/get-logs-customer', auth.checkLoggedIn, supporter.getLogsCustomer);
    router.post('/supporter/done-comment', auth.checkLoggedIn, supporter.postDoneComment);

    router.post('/api/get-info-merchant-by-id', merchant.getInfoMerchantById);
    router.post('/api/get-detail-customer-by-id', home.getDetailCustomerBooking);

    router.delete('/admin/delete/merchant', auth.checkLoggedIn, admin.deleteMerchantById);
    router.delete('/admin/delete/specialization', auth.checkLoggedIn, admin.deleteSpecializationById);
    router.delete('/admin/delete/post', auth.checkLoggedIn, admin.deletePostById);

    router.get("/login", auth.checkLoggedOut, auth.getLogin);

    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            // Redirect if it fails
            if (!user) {
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                req.session.save(() => {
                    // Redirect if it succeeds
                    return res.redirect('/users');
                });

            });
        })(req, res, next);
    });

    router.get('/register', auth.getRegister);
    router.post("/register",  auth.postRegister);
    // router.get("/verify/:token", auth.verifyAccount);

    router.get("/logout", auth.checkLoggedIn, auth.getLogout);

    router.post("/admin/statistical", auth.checkLoggedIn, admin.getInfoStatistical);

    return app.use("/", router);
};
module.exports = initRoutes;
