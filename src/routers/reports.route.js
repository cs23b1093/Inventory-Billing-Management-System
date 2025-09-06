import express from "express";
import { getInventoryReport, getTransactionReport } from "../controllers/reports.controller.js";
import getUserByCookies from "../middleware/getUser.js";

const reportsRouter = express.Router();

reportsRouter.use(getUserByCookies);
reportsRouter.route('/inventory').get(getInventoryReport);
reportsRouter.route('/transaction').get(getTransactionReport);

export default reportsRouter;