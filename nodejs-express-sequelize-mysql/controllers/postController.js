const sqlPost = require('../db/postSQL');
// error-viesti laitetaan omaan kansioon, josta sitä kutsutaan
const errori = require('./utils/utils');



module.exports = {

    haeKaikki: async (req, res) => {
        try {
            let postId = null;
            let title = null;

            if (req.query.postId) postId = req.query.postId;
            if (req.query.title) title = req.query.title;

            console.log("postId: ", postId);
            console.log("title: ", title);

            let postit = await sqlPost.getPosts(postId, title);
            res.statusCode = 200;
            console.log("result:", postit);
            // res.json(t);
            res.json({ status: "OK", data: postit });
        }
        catch (err) {
            // console.log("Error in server")
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },

    haePost: async (req, res) => {
        try {
            let posti = await sqlPost.getPost(req.params.postId); // haetaan oppilas tiedot koululainen-taulusta koululainen id llä
            console.log("posti: ", posti);

            res.json({ status: "OK", data: posti });   // response reactille 
        }
        catch (err) {
            errori.createErrorMessage(res, err);
        }
    },

    lisaa: async (req, res) => {
        try {
            let postId = null;
            let title = null;
            let content = null;
            let category = null;
            let verified = null;
            let blogId = null;

            if (req.body.postId) postId = req.body.postId;
            if (req.body.title) title = req.body.title;
            if (req.body.content) content = req.body.content;
            if (req.body.category) category = req.body.category;
            if (req.body.verified) verified = req.body.verified;
            if (req.body.blogId) blogId = req.body.blogId;

            if (title) {
                let result = await sqlPost.insertPost({ title: title, content: content, category: category, verified: verified, blogId: blogId });
                let a = await sqlPost.getPost(result.insertId);
                let c = { title: a.title, content: a.content, category: a.category, verified: a.verified, blogId: a.blogId };
                res.json({ status: "OK", result: c });
            }
            else {
                res.statusCode = 400;
                res.json({ status: "NOT OK", msg: "Pakollisia kenttiä puuttuu" });
            }
        }
        catch (err) {
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: err });
        }
    },

    edit: async (req, res) => {
        if (req.params.postId && req.body) {
            try {

                let values = {};
                if (req.body.title) values = { ...values, title: req.body.title }
                if (req.body.content) values = { ...values, content: req.body.content }
                if (req.body.category) values = { ...values, category: req.body.category }
                if (req.body.verified) values = { ...values, verified: req.body.verified }
                if (req.body.blogId) values = { ...values, blogId: req.body.blogId }

                console.log("values: ", values);

                let result = await sqlPost.editPost(values, req.params.postId);
                console.log("result.insertId: ", result.insertId);
                let r = await sqlPost.getPost(req.params.postId);
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
        const postId = req.params.postId;
        if (postId) {
            try {
                let result = await sqlPost.deletePost(postId);
                res.statusCode = 204;
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