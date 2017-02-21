'use strict';
const router = require("koa-router")();
const controller = require('./task.controller');
const auth = require('../../auth/auth.service');

router.get('/daily/:date', auth.isAuthenticated(), controller.getDailyTask);
router.put('/daily/:date', auth.isAuthenticated(), controller.updateDailyTask);
router.put('/score/:date', auth.isAuthenticated(), controller.updateDailyScore);
router.put('/state/:date', auth.isAuthenticated(), controller.updateDailyState);
router.post('/schedule/:date', auth.isAuthenticated(), controller.createSchedule);
router.get('/schedule/:date', auth.isAuthenticated(), controller.getSchedule);
router.put('/schedule/:id', auth.isAuthenticated(), controller.updateSchedule);
router.get('/calendar', auth.isAuthenticated(), controller.getCalendar);
module.exports = router;
