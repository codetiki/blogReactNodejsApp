const Table = require('./utils/dbutils');


module.exports = {

    getPost: (postId) => {
        let query = "SELECT * FROM post WHERE postId = ? ";
        return Table.executeGetSingleSQL(query, [postId]);
    },

    getPosts: (postId, title) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM post WHERE 1=1 ";

        let params = [];
        if (postId != null) {
            query += " AND postId like ? "
            params.push(postId + "%");
        }
        if (title != null) {
            query += " AND title like ? "
            params.push(title + "%");
        }


        return Table.executeSQL(query, params);
    },

    insertPost: (post) => {
        console.log("title: ", post.title);
        let query = "INSERT INTO post (title, content, category, verified, blogId) VALUES (?, ?, ?, ?, ?) ";
        let params = [post.title, post.content, post.category, post.verified, post.blogId];
        console.log("params: ", params);
        return Table.executeSQL(query, params);
    },

    editPost: (values, postId) => {
        console.log("editBlogSQL alkaa: ", postId);
        let query = "UPDATE post SET ? WHERE postId = ?";
        console.log("query: ", query);
        return Table.executeSQL(query, [values, postId]);
    },

    deletePost: (postId) => {
        let query = "DELETE FROM post WHERE postId=? ";
        return Table.executeGetSingleSQL(query, [postId]);
    },


}