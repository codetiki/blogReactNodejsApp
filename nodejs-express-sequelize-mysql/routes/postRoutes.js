var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/postController');

router.route('/api/post').
    get(ctrl.haeKaikki).
    post(ctrl.lisaa);

router.route('/api/post/:postId').
    get(ctrl.haePost).
    put(ctrl.edit).
    delete(ctrl.delete);

// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;
