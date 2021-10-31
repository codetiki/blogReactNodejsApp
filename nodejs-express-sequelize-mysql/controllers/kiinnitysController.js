const sqlKiinnitys = require('../db/kiinnitysSQL');
// error-viesti laitetaan omaan kansioon, josta sitä kutsutaan
const errori = require('./utils/utils');



module.exports = {

    haeKaikki: async (req, res) => {
        try {

            let tarveId_Id = null;
            let postId_Id = null;

            if (req.query.tarveId_Id) tarveId_Id = req.query.tarveId_Id;
            if (req.query.postId_Id) postId_Id = req.query.postId_Id;

            console.log("tarveId_Id: ", tarveId_Id);
            console.log("postId_Id: ", postId_Id);

            let kiinnitykset = await sqlKiinnitys.getKiinnitykset(tarveId_Id, postId_Id);
            res.statusCode = 200;
            console.log("result:", kiinnitykset);
            // res.json(t);
            res.json({ status: "OK", data: kiinnitykset });
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },

    haeKiinnitys: async (req, res) => {
        try {
            let ploki = await sqlKiinnitys.getKiinnitys(req.params.id); // haetaan oppilas tiedot koululainen-taulusta koululainen id llä
            console.log("laitos: ", ploki);

            res.json({ status: "OK", data: ploki });   // response reactille 
        }
        catch (err) {
            errori.createErrorMessage(res, err);
        }
    },

    lisaa: async (req, res) => {
        // console.log("nimikkeen lisäys alkaa ...", req.body);

        try {

            let tarveId_Id = null;
            let postId_Id = null;


            if (req.body.tarveId_Id) tarveId_Id = req.body.tarveId_Id;
            if (req.body.postId_Id) postId_Id = req.body.postId_Id;

            if (tarveId_Id) {
                console.log("Uuden lisääminen alkaa 2...");
                let result = await sqlKiinnitys.insertKiinnitys(tarveId_Id, postId_Id);
                console.log("insert done:", result);
                let a = await sqlKiinnitys.getKiinnitys(result.insertId);
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
    /*
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