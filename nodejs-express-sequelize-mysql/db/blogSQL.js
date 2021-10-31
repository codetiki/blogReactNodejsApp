const Table = require('./utils/dbutils');


module.exports = {

    getBlog: (blogId) => {
        let query = "SELECT * FROM blog WHERE blogId = ? ";
        return Table.executeGetSingleSQL(query, [blogId]);
    },

    getBlogs: (blogId, url) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM blog WHERE 1=1 ";

        let params = [];
        if (blogId != null) {
            query += " AND blogId like ? "
            params.push(blogId + "%");
        }
        if (url != null) {
            query += " AND url like ? "
            params.push(url + "%");
        }


        return Table.executeSQL(query, params);
    },

    insertBlog: (url) => {
        console.log("url: ", url);
        let query = "INSERT INTO blog (url) VALUES (?) ";
        let params = [url];
        console.log("params: ", params);
        return Table.executeSQL(query, params);
    },

    editBlog: (values, blogId) => {
        console.log("editBlogSQL alkaa: ", blogId);
        let query = "UPDATE blog SET ? WHERE blogId = ?";
        console.log("query: ", query);
        return Table.executeSQL(query, [values, blogId]);
    },

    deleteBlog: (blogId) => {
        let query = "DELETE FROM blog WHERE blogId=? ";
        return Table.executeGetSingleSQL(query, [blogId]);
    },


}