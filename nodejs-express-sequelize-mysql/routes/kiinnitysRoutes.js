var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/kiinnitysController');

router.route('/api/kiinnitys').
    get(ctrl.haeKaikki).
    post(ctrl.lisaa);

router.route('/api/post/:postId').
    get(ctrl.haeKiinnitys);

// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;