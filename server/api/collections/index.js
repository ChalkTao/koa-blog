'use strict';
const router = require("koa-router")();
const controller = require('./collections.controller');
const auth = require('../../auth/auth.service');

router.post('/:rid', auth.isAuthenticated(), controller.addToCollection);
router.delete('/:rid', auth.isAuthenticated(), controller.removeFromCollection);
router.put('/:rid', auth.isAuthenticated(), controller.updateCollection);
router.get('/', auth.isAuthenticated(), controller.getCollection);

module.exports = router;
