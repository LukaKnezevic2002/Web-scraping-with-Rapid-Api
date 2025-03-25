const msql = require("mysql");
const axios = require("axios");

const conn = msql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "objects"
});

conn.connect((err) => {
    if (err) {
        console.log("Error" + err);
    } else {
        console.log("Database connected!");
    }
});

async function updateBatch(offset) {
    conn.query(`SELECT id, detailsJsonResponse FROM places LIMIT 4000 OFFSET ${offset}`, async (err, results) => {
        if (err) {
            console.log("error" + err);
            return;
        }
        
        if (results.length === 0) {
            console.log("No more records to update.");
            return;
        }

        for (let i = 0; i < results.length; i++) {
            let id = results[i].id;
            let jsonResponse = results[i].detailsJsonResponse;
            let parsedData;
        
            try {
                parsedData = JSON.parse(jsonResponse);
            } catch (e) {
                console.log("JSON parse error for id " + id + ": ", e);
                parsedData = null;
            }

            let zip = parsedData?.data?.[0]?.zipcode || "";
        
            //let latitude = parsedData?.data?.[0]?.latitude ?? "";
            //let longitude = parsedData?.data?.[0]?.longitude ?? "";

            conn.query(`UPDATE places SET zip = ? WHERE id = ?`, [zip, id], (err) => {
                if (err) {
                    console.log("Update error: " + err);
                } else {
                   //console.log("Updated successfully");
                }
            });
        }

        updateBatch(offset + 4000);
    });
}

updateBatch(0);