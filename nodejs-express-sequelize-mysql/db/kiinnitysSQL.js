const Table = require('./utils/dbutils');


module.exports = {
	
	 /*
    getVapaatTarpeet: (tarveId) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM kiinnitys k JOIN tarve t ON t.tarveId = k.tarveId_Id WHERE 1=1";

        let params = [];
        if (tarveId != null) {
            query += " AND tarveId like ? "
            params.push(tarveId + "%");
        }
        return Table.executeSQL(query, params);
    },
    */

    getKiinnitys: (id) => {
        let query = "SELECT * FROM kiinnitys WHERE id = ? ";
        return Table.executeGetSingleSQL(query, [id]);
    },

    getKiinnitykset: (tarveId_Id, postId_Id) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM kiinnitys WHERE 1=1 ";

        let params = [];
        if (tarveId_Id != null) {
            query += " AND tarveId_Id like ? "
            params.push(tarveId_Id + "%");
        }
        if (postId_Id != null) {
            query += " AND postId_Id like ? "
            params.push(postId_Id + "%");
        }


        return Table.executeSQL(query, params);
    },

    insertKiinnitys: (tarveId_Id, postId_Id) => {

        let query = "INSERT INTO kiinnitys (tarveId_Id, postId_Id) VALUES (?, ?) ";
        let params = [tarveId_Id, postId_Id];
        console.log("params: ", params);
        return Table.executeSQL(query, params);
    },
    /*
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
    */

}