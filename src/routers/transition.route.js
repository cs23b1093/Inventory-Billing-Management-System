import express from "express";
import { createTransition, getTransitions } from "../controllers/transition.controller.js";

const transitionRouter = express.Router();

transitionRouter.route('/create').post(createTransition);
transitionRouter.route('/all').get(getTransitions);

export default transitionRouter;