var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/blogController');

router.route('/api/blog').
    get(ctrl.haeKaikki).
    post(ctrl.lisaa);

router.route('/api/blog/:blogId').
    get(ctrl.haeBlog).
    put(ctrl.edit).
    delete(ctrl.delete);

// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;
