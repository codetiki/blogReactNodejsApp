const sqlTarve = require('../db/tarveSQL');
const sqlKiinnitys = require('../db/kiinnitysSQL');
// error-viesti laitetaan omaan kansioon, josta sitä kutsutaan
const errori = require('./utils/utils');



module.exports = {

    haeKaikki: async (req, res) => {
        try {
            let tarveId = null;
            let kpl = null;

            if (req.query.tarveId) tarveId = req.query.tarveId;
            if (req.query.kpl) kpl = req.query.kpl;

            console.log("tarveId: ", tarveId);
            console.log("kpl: ", kpl);

            let tarpeet = await sqlTarve.getTarpeet(tarveId, kpl);
            res.statusCode = 200;
            console.log("result:", tarpeet);
            // res.json(t);
            res.json({ status: "OK", data: tarpeet });
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },
    /*
    haeKaikkiVapaat: async (req, res) => {
        try {
            let tarveId = null;


            if (req.query.tarveId) tarveId = req.query.tarveId;


            console.log("tarveId: ", tarveId);
            console.log("kpl: ", kpl);

            let tarpeet = await sqlTarve.getVapaatTarpeet(tarveId);
            res.statusCode = 200;
            console.log("result:", tarpeet);
            // res.json(t);
            res.json({ status: "OK", data: tarpeet });
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },
    */



    // Luo TarpeidenHaku, joka tarkistaa onko tarve jo kiinnityksissä
    // Hakee ensin kaikki vapaat tarveId:t
    haeVapaatTarpeet: async (req, res) => {
        try {
            let tarpeet = await sqlTarve.getTarpeet(null, null);
            console.log("tarpeet:", tarpeet);
            let kiinnitykset = await sqlKiinnitys.getKiinnitykset(null, null);
            console.log("kiinnitykset:", kiinnitykset);

            var k = []; // Laistan alustaminen
            var t = []; // Laistan alustaminen
            var arr = []; // Laistan alustaminen
            for (var i = 0; i < kiinnitykset.length; i++) {
                k.push(kiinnitykset[i].tarveId_Id);
            }
            console.log("k:", k);
            for (var j = 0; j < tarpeet.length; j++) {
                t.push(tarpeet[j].tarveId)
            }
            console.log("t:", t);
            for (var i = 0; i < kiinnitykset.length; i++) {
                for (var j = 0; j < tarpeet.length; j++) {
                    if (t[j] !== k[i]) {
                        arr.indexOf(t[j]) === -1 ? arr.push(t[j]) : console.log("This item already exists");
                    }
                }
            }

            arr.sort((a, b) => a - b);
            console.log(arr);
            //res.json({ status: "OK", data: kiinnitykset });   // response reactille/postmanille 
            let unique1 = k.filter((o) => t.indexOf(o) === -1);
            let unique2 = t.filter((o) => k.indexOf(o) === -1);

            const unique = unique1.concat(unique2);

            console.log(unique);

            let tulos = [];
            if (unique.length > 0) {

                for (let i = 0; i < unique.length; i++) {

                    let tarpeet = await sqlTarve.getTarve(unique[i]);
                    tulos[i] = { ...tarpeet };
                    //console.log("result:", arr);
                }
                res.json({ status: "OK", data: tulos });
            }
        }
        catch (err) {
            errori.createErrorMessage(res, err);
        }
    },
    /*
    lisaa: async (req, res) => {
        // console.log("nimikkeen lisäys alkaa ...", req.body);

        try {
            let blogId = null;
            let url = null;

            if (req.body.blogId) blogId = req.body.blogId;
            if (req.body.url) url = req.body.url;
            //if (req.query.url) url = req.query.url;

            // console.log("Uuden lisääminen alkaa 1...");
            // console.log("ammatti: ", ammatti);
            // console.log("aktiivinen: ", aktiivinen);
            if (url) {
                console.log("Uuden lisääminen alkaa 2...");
                let result = await sqlBlog.insertBlog(url);
                console.log("insert done:", result);
                let a = await sqlBlog.getBlog(result.insertId);
                console.log("a:", a);

                let c = { url: a.url };
                res.json({ status: "OK", result: c });
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Pakollisia kenttiä puuttuu" });
            }
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },

    edit: async (req, res) => {
        if (req.params.blogId && req.body) {
            try {

                let values = {};
                if (req.body.url) values = { ...values, url: req.body.url }


                console.log("values: ", values);

                let result = await sqlBlog.editBlog(values, req.params.blogId);
                console.log("result.insertId: ", result.insertId);
                let r = await sqlBlog.getBlog(req.params.blogId);
                res.json({ status: "OK", data: r });
            }
            catch (err) {
                errori.createErrorMessage(res, err);
            }
        } else {
            errori.createErrorMessage(res, 'Tietoja puuttuu!');
        }
    },

    delete: async (req, res) => {
        const blogId = req.params.blogId;
        if (blogId) {
            try {
                let result = await sqlBlog.deleteBlog(blogId);
                // console.log("result: ", result);
                res.statusCode = 204;
                // res.json();
                res.json();

            }
            catch (err) {
                res.statusCode = 400;
                errori.createErrorMessage(res, "Virhe: " + err.message);
            }
        } else {
            errori.createErrorMessage(res, 'Tietoja puuttuu!');
        }
    },
    */


}