'use strict';
const router = require("koa-router")();
const controller = require('./task.controller');
const auth = require('../../auth/auth.service');

router.get('/daily/:date', auth.isAuthenticated(), controller.getDailyTask);
router.put('/daily/:date', auth.isAuthenticated(), controller.updateDailyTask);
router.put('/score/:date', auth.isAuthenticated(), controller.updateDailyScore);
router.put('/state/:date', auth.isAuthenticated(), controller.updateDailyState);

module.exports = router;
