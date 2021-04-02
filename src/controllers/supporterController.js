require('dotenv').config();
import homeService from "../services/homeService";
import userService from "../services/userService";
import supporterService from "../services/supporterService";
import customerService from "../services/customerService";

const statusNewId = 4;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;


let getNewCustomers = (req, res) => {
    //render data = js/ getForCustomersTabs
    return res.render('main/users/admins/manageCustomer.ejs', {
        user: req.user
    })
};

let getAllPosts = async (req, res) => {
    try {
        let posts = await supporterService.getAllPosts();
        return res.status(200).json({ "data": posts })
    } catch (e) {
        return res.status(500).json(e);
    }
};

let getCreatePost = async (req, res) => {
    let merchants = await userService.getInfoMerchants();
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/createPost.ejs', {
        user: req.user,
        merchants: merchants,
        specializations: specializations
    });
};

let postCreatePost = async (req, res) => {
    try {
        let item = req.body;
        item.writerId = req.user.id;
        item.createdAt = Date.now();
        let post = await supporterService.postCreatePost(item);
        return res.status(200).json({
            status: 1,
            message: post
        })
    } catch (e) {
        return res.status(500).json(e);
    }
};

let getManagePosts = async (req, res) => {
    try {
        let role = "";
        if(req.user){
            if(req.user.roleId === 1) role = "admin";
        }
        let object = await supporterService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
        return res.render('main/users/admins/managePost.ejs', {
            user: req.user,
            posts: object.posts,
            total: object.total
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getPostsPagination = async (req, res) => {
    try {
        let page = +req.query.page;
        let limit = +process.env.LIMIT_GET_POST;
        if (!page) {
            page = 1;
        }
        let object = await supporterService.getPostsPagination(page, limit);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getForCustomersTabs = async (req, res) => {
    try {
        let object = await customerService.getForCustomersTabs();
        return res.status(200).json({
            'message': 'success',
            'object': object
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postChangeStatusCustomer = async (req, res) => {
    try {
        let id = req.body.customerId;
        let status = req.body.status;
        let statusId = '';
        let content = '';
        if (status === 'pending') {
            statusId = statusPendingId;
            content = "New appointments have been received";
        } else if (status === 'failed') {
            statusId = statusFailedId;
            if (req.body.reason) {
                content = `Cancel with reason - ${req.body.reason}`;
            }

        } else if (status === 'confirmed') {
            statusId = statusSuccessId;
            content = "The appointment has been successfully booked";
        }


        let data = {
            id: id,
            statusId: statusId,
            updatedAt: Date.now()
        };

        let logs = {
            supporterId: req.user.id,
            customerId: id,
            content: content
        };

        let customer = await customerService.changeStatusCustomer(data, logs);
        return res.status(200).json({
            'message': 'success',
            'customer': customer
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageCustomersPage = async (req, res) => {
    try {
        let comments = await customerService.getComments();
        return res.render("main/users/admins/manageFeedback.ejs", {
            user: req.user,
            comments: comments
        });
    } catch (e) {
        console.log(e)
    }
};

let getLogsCustomer = async (req, res) => {
    try {
        let logs = await customerService.getLogsCustomer(req.body.customerId);
        return res.status(200).json(logs);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let postDoneComment = async (req, res) => {
    try {
        let comment = await supporterService.doneComment(req.body.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
module.exports = {
    getNewCustomers: getNewCustomers,
    getManagePosts: getManagePosts,
    getCreatePost: getCreatePost,
    postCreatePost: postCreatePost,
    getAllPosts: getAllPosts,
    getPostsPagination: getPostsPagination,
    getForCustomersTabs: getForCustomersTabs,
    postChangeStatusCustomer: postChangeStatusCustomer,
    getManageCustomersPage: getManageCustomersPage,
    getLogsCustomer: getLogsCustomer,
    postDoneComment: postDoneComment
};
