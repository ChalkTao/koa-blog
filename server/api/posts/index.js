'use strict';
const router = require("koa-router")();
const controller = require('./post.controller');
const auth = require('../../auth/auth.service');

router.put('/:id', auth.isAuthenticated(), controller.updateRoom);
router.delete('/:id', auth.isAuthenticated(), controller.deleteRoom);
router.put('/status/:id', auth.isAuthenticated(), controller.updateRoomStatus);
router.get('/user/me', auth.isAuthenticated(), controller.getMyRoom);
router.get('/user/:id', auth.mayAuthenticated(), controller.getUserRoom);
router.get('/list', auth.mayAuthenticated(), controller.getRoomList);
router.get('/new', auth.isAuthenticated(), controller.createRoom);
router.get('/:id', auth.mayAuthenticated(), controller.getRoom);

module.exports = router;
