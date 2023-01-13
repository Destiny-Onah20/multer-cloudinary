const cloudinary = require("../helpers/cloudinary");
const validator = require("fastest-validator");
const fs = require("fs")
const { request } = require("http");
const models = require("../models").blog;

const createPost = async(req,res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const dataCreate = {
            title: req.body.title,
            desc: req.body.desc,
            image:req.file.path,
            content: req.body.content,
            cloudUrl: result.secure_url,
            cloudId: result.public_id
        };
        const schema = {
            title: {type: "string", optional: false},
            desc: {type: "string", optional: false},
            image: {type: "string", optional: false},
            content: {type: "string", optional: false},
            cloudUrl: {type: "string", optional: false},
            cloudId: {type: "string", optional: false},
        };
        const valid = new validator().validate(dataCreate, schema)
        if(valid === true){
            const created = await models.create(dataCreate)
            res.status(201).json({
                data: created
            })
        }else{
            res.status(400).json({
                message: valid[0].message
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};

const updatePost = async(req,res)=>{
    try {
        let id = req.params.id;
        const checkId = await models.findAll({where:{id:id}});
        const result = await cloudinary.uploader.upload(req.file.path);
        const dataUpdate = {
            title: req.body.title,
            desc: req.body.desc,
            image:req.file.path,
            content: req.body.content,
            cloudUrl: result.secure_url,
            cloudId: result.public_id
        };
        const schema = {
            title: {type: "string", optional: false},
            desc: {type: "string", optional: false},
            image: {type: "string", optional: false},
            content: {type: "string", optional: false},
            cloudUrl: {type: "string", optional: false},
            cloudId: {type: "string", optional: false},
        };
        const valid = new validator().validate(dataUpdate, schema)
        if(valid === true){
            await fs.unlinkSync(checkId[0].image)
            const updated = await models.update(dataUpdate, {where:{id:id}})
            res.status(201).json({
                message: "updated successfully",
                data: updated
            })
        }else{
            res.status(400).json({
                message: valid[0].message
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};


const allPost = async(req,res)=>{
    try {
        const all = await models.findAll();
        if(all.length === 0){
            res.status(400).json({
                message: "database currently Empty"
            })
        }else{
            res.status(200).json({
                message: "All records in the database " + all.length,
                data: all
            })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }
};

const getOnePost = async(req,res)=>{
    try {
        let id = req.params.id;
        const single = await models.findAll({where:{id:id}});
        if(single.length === 0){
            res.status(404).json({
                message: `post with this id ${id} not found`
            })
        }else{
        res.status(200).json({
            data: single
        })
        }
    } catch (error) {
    res.status(404).json({
         message: error.message
    })
    }
};

const deletePost = async(req,res)=>{
    try {
        let id = req.params.id;
        const single = await models.findAll({where:{id:id}});
        await fs.unlinkSync(single[0].image)
        await cloudinary.uploader.destroy(single[0].cloudId)
        const del = await models.destroy({where:{id:id}})
        res.status(200).json({
            message: "Post deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}


module.exports = {
    createPost,
    updatePost,
    allPost,
    getOnePost,
    deletePost
};