'use strict'

const router = require("koa-router")();
const controller = require('./configs.controller');

router.get('/uploadToken', controller.getUploadToken);
router.get('/getApps', controller.getApps);

module.exports = router;
