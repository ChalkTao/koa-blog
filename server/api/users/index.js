'use strict';
const router = require("koa-router")();
const controller = require('./user.controller');
const auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.get('/:_id', controller.getUser);
router.put('/',  auth.isAuthenticated(), controller.updateUser);

module.exports = router;
