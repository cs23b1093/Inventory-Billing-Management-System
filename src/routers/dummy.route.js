import express from "express";

const dummyRouter = express.Router();

dummyRouter.route('/dummy').get((req, res) => {
    res.status(200).json({
        message: 'dummy route'
    })
})

export default dummyRouter;