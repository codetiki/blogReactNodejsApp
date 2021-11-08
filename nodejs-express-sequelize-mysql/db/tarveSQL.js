const Table = require('./utils/dbutils');


module.exports = {
    // Tämä funktio lisätty 08.11.2021
    // Hakee kaikki tarpeet, joita ei ole kiinnitys-taulussa.
    getVapaatTarpeet: (tarveId) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM tarve t ";
        query += "WHERE NOT EXISTS (SELECT * FROM kiinnitys k WHERE t.tarveId = k.tarveId_Id ) ";

        let params = [];
        if (tarveId != null) {
            query += " AND tarveId like ? "
            params.push(tarveId + "%");
        }
        return Table.executeSQL(query, params);
    },

    getTarve: (tarveId) => {
        let query = "SELECT * FROM tarve WHERE tarveId = ? ";
        return Table.executeGetSingleSQL(query, [tarveId]);
    },

    getTarpeet: (tarveId, kpl) => {
        // console.log("getNimikkeet SQL alkaa...");
        let query = "SELECT * FROM tarve WHERE 1=1 ";

        let params = [];
        if (tarveId != null) {
            query += " AND tarveId like ? "
            params.push(tarveId + "%");
        }
        if (kpl != null) {
            query += " AND kpl like ? "
            params.push(kpl + "%");
        }


        return Table.executeSQL(query, params);
    },

    /*
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
    */

}