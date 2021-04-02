import homeService from "./../services/homeService";
import userService from "./../services/userService";
import specializationService from "./../services/specializationService";
import supporterService from "./../services/supporterService";
import merchantService from "./../services/merchantService";
import multer from "multer";

let getManageMerchant = async (req, res) => {
    let merchants = await userService.getInfoMerchants();
    return res.render("main/users/admins/manageMerchant.ejs", {
        user: req.user,
        merchants: merchants,
    });
};


let getCreateMerchant = async (req, res) => {
    let specializations = await homeService.getSpecializations();
    return res.render("main/users/admins/createMerchant.ejs", {
        user: req.user,
        specializations: specializations
    });
};
let postCreateMerchant = async (req, res) => {
    let merchant = {
        'name': req.body.name,
        'phone': req.body.phone,
        'email': req.body.email,
        'password': req.body.password,
        'specializationId': req.body.specialization,
        'address': req.body.address,
        'avatar': 'business.jpg',
        'description': req.body.description
    };
    try {
        await userService.createMerchant(merchant);
        return res.status(200).json({ message: 'success' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err })
    }
};



let getSpecializationPage = async (req, res) => {
    let specializations = await specializationService.getAllSpecializations();
    return res.render("main/users/admins/manageSpecialization.ejs", {
        user: req.user,
        specializations: specializations
    });
};

let deleteMerchantById = async (req, res) => {
    try {
        let merchant = await merchantService.deleteMerchantById(req.body.id);
        return res.status(200).json({
            'message': 'success'
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getEditMerchant = async (req, res) => {
    let merchant = await merchantService.getMerchantForEditPage(req.params.id);
    let specializations = await homeService.getSpecializations();
    return res.render("main/users/admins/editMerchant.ejs", {
        user: req.user,
        merchant: merchant,
        specializations: specializations
    })
};

let putUpdateMerchantWithoutFile = async (req, res) => {
    try {
        let item = {
            id: req.body.id,
            name: req.body.nameMerchant,
            phone: req.body.phoneMerchant,
            address: req.body.addressMerchant,
            description: req.body.introEditMerchant,
            specializationId: req.body.specializationMerchant
        };
        await merchantService.updateMerchantInfo(item);
        return res.status(200).json({
            message: 'update info merchant successful'
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
};

let putUpdateMerchant = (req, res) => {
    imageMerchantUploadFile(req, res, async (err) => {
        if (err) {
            if (err.message) {
                return res.status(500).send(err.message);
            } else {
                return res.status(500).send(err);
            }
        }

        try {
            let item = {
                id: req.body.id,
                name: req.body.nameMerchant,
                phone: req.body.phoneMerchant,
                address: req.body.addressMerchant,
                description: req.body.introEditMerchant,
                specializationId: req.body.specializationMerchant
            };
            let imageMerchant = req.file;
            item.avatar = imageMerchant.filename;
            let merchant = await merchantService.updateMerchantInfo(item);
            return res.status(200).json({
                message: 'update merchant info successful',
                merchant: merchant
            });

        } catch (e) {
            return res.status(500).send(e);
        }
    });
};

let storageImageMerchant = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/users");
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

let imageMerchantUploadFile = multer({
    storage: storageImageMerchant,
    limits: { fileSize: 1048576 * 20 }
}).single("avatar");

let getSupporterPage = async (req, res) => {
    let supporters = await supporterService.getAllSupporters();
    return res.render("main/users/admins/manageSupporter.ejs", {
        user: req.user,
        supporters: supporters
    })
};

let deleteSpecializationById = async (req, res) => {
    try {
        await specializationService.deleteSpecializationById(req.body.id);
        return res.status(200).json({
            message: 'delete specialization successful'
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }

};



let deletePostById = async (req, res) => {
    try {
        await supporterService.deletePostById(req.body.id);
        return res.status(200).json({
            message: 'delete post successful'
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getEditPost = async (req, res) => {
    try {
        let merchants = await userService.getInfoMerchants();
        let specializations = await homeService.getSpecializations();
        let post = await supporterService.getDetailPostPage(req.params.id);
        return res.render('main/users/admins/editPost.ejs', {
            merchants: merchants,
            specializations: specializations,
            user: req.user,
            post: post
        });

    } catch (e) {
        console.log(e);
    }
};

let putUpdatePost = async (req, res) => {
    try {
        let data = {
            id: req.body.id,
            title: req.body.titlePost,
            forMerchantId: req.body.forMerchantId,
            forSpecializationId: req.body.forSpecializationId,
            writerId: req.user.id,
            contentMarkdown: req.body.contentMarkdown,
            contentHTML: req.body.contentHTML,
            updatedAt: Date.now()
        };

        await supporterService.putUpdatePost(data);
        return res.status(200).json({
            message: 'update post successful'
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getManageCreateScheduleForMerchantsPage = async (req, res) => {
    try {
        return res.render('main/users/admins/manageScheduleForMerchants.ejs', {
            user: req.user,
        })
    } catch (e) {
        console.log(e);
    }

};

let getInfoStatistical = async (req, res) => {
    try {
        let month = req.body.month;
        let object = await userService.getInfoStatistical(month);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

module.exports = {
    getManageMerchant: getManageMerchant,
    getCreateMerchant: getCreateMerchant,
    getSpecializationPage: getSpecializationPage,
    getEditMerchant: getEditMerchant,
    getSupporterPage: getSupporterPage,

    getEditPost: getEditPost,
    getManageCreateScheduleForMerchantsPage: getManageCreateScheduleForMerchantsPage,
    getInfoStatistical: getInfoStatistical,

    postCreateMerchant: postCreateMerchant,

    putUpdateMerchantWithoutFile: putUpdateMerchantWithoutFile,
    putUpdateMerchant: putUpdateMerchant,
    putUpdatePost: putUpdatePost,

    deleteMerchantById: deleteMerchantById,
    deleteSpecializationById: deleteSpecializationById,
    deletePostById: deletePostById
};
