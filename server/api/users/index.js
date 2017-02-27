'use strict';
const router = require("koa-router")();
const controller = require('./user.controller');
const auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.get('/name/:name', controller.getUserByName);
router.get('/list', controller.getUsers);
router.get('/:_id', controller.getUser);
router.put('/',  auth.isAuthenticated(), controller.updateUser);

module.exports = router;
