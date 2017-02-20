'use strict';
const router = require("koa-router")();
const controller = require('./article.controller');
const auth = require('../../auth/auth.service');

router.put('/:id', auth.isAuthenticated(), controller.updateArticle);
router.delete('/:id', auth.isAuthenticated(), controller.deleteArticle);
router.put('/status/:id', auth.isAuthenticated(), controller.updateArticleStatus);
router.get('/category/:uid', auth.mayAuthenticated(), controller.getCategory);
router.get('/user/:uid', auth.mayAuthenticated(), controller.getUserArticle);
router.get('/new', auth.isAuthenticated(), controller.createArticle);
router.get('/:id', auth.mayAuthenticated(), controller.getArticle);

module.exports = router;
