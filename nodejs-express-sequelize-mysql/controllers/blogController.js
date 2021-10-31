const sqlBlog = require('../db/blogSQL');
// error-viesti laitetaan omaan kansioon, josta sitä kutsutaan
const errori = require('./utils/utils');



module.exports = {

    haeKaikki: async (req, res) => {
        try {
            let blogId = null;
            let url = null;

            if (req.query.blogId) blogId = req.query.blogId;
            if (req.query.url) url = req.query.url;

            console.log("blogId: ", blogId);
            console.log("url: ", url);

            let blogit = await sqlBlog.getBlogs(blogId, url);
            res.statusCode = 200;
            console.log("result:", blogit);
            // res.json(t);
            res.json({ status: "OK", data: blogit });
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },

    haeBlog: async (req, res) => {
        try {
            let ploki = await sqlBlog.getBlog(req.params.blogId); // haetaan oppilas tiedot koululainen-taulusta koululainen id llä
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



}