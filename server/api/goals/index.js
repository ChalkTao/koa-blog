'use strict';
const router = require("koa-router")();
const controller = require('./goal.controller');
const auth = require('../../auth/auth.service');

router.get('/:date', auth.isAuthenticated(), controller.getGoal);
router.post('/:date', auth.isAuthenticated(), controller.createGoal);
router.put('/:id', auth.isAuthenticated(), controller.updateGoal);
router.delete('/:id', auth.isAuthenticated(), controller.deleteGoal);

module.exports = router;