var express = require('express');
var app = express();
var router = express.Router();

let ctrl = require('../controllers/tarveController');

router.route('/api/tarve').
    get(ctrl.haeKaikki);
router.route('/api/vapaatarve').
    get(ctrl.haeVapaatTarpeet);
/*
router.route('/api/post/:postId').
    get(ctrl.haePost).
    put(ctrl.edit).
    delete(ctrl.delete);
*/
// Julkaistaan ao. funktiot tämän js-filun ulkopuolelle
module.exports = router;