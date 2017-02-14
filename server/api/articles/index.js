'use strict';
const router = require("koa-router")();
const controller = require('./article.controller');
const auth = require('../../auth/auth.service');

router.put('/:id', auth.isAuthenticated(), controller.updateArticle);
router.delete('/:id', auth.isAuthenticated(), controller.deleteRoom);
router.put('/status/:id', auth.isAuthenticated(), controller.updateRoomStatus);
router.get('/user/me', auth.isAuthenticated(), controller.getMyRoom);
router.get('/user/:id', auth.mayAuthenticated(), controller.getUserRoom);
router.get('/list', auth.mayAuthenticated(), controller.getRoomList);
router.get('/new', auth.isAuthenticated(), controller.createArticle);
router.get('/:id', auth.mayAuthenticated(), controller.getArticle);

module.exports = router;
