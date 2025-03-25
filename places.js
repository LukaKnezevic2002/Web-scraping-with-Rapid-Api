const msql = require("mysql");
const axios = require('axios');

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

let totalInserts = 0;

async function rapidApi(query) {
    
    try {
        const options = {
            method: 'GET',
            url: 'https://local-business-data.p.rapidapi.com/search',
            params: {
                query: query,
                limit: '15',
                language: 'en',
                region: 'us'
            },
            headers: {
                'X-RapidAPI-Key': '80e10d776bmsh6d8f64d7ca6c24bp1136e7jsn721cbc91ed70',
                'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
              }
        };

        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("Places limit broken");
        return null;
    }
}

async function getBusinessDetails(businessId) {

    const options = {
        method: 'GET',
        url: 'https://local-business-data.p.rapidapi.com/business-details',
        params: {
            business_id: businessId.replace(/^'(.+)'$/, "$1"),
            extract_emails_and_contacts: 'true',
            extract_share_link: 'false',
            region: 'us',
            language: 'en'
        },
        headers: {
            'X-RapidAPI-Key': '80e10d776bmsh6d8f64d7ca6c24bp1136e7jsn721cbc91ed70',
            'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
          }
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("Details limit broken");
        return null;
    }
}

conn.query('SELECT * FROM keywords WHERE status = ""', async (err, results) => {
    if (err) {
        console.log("error" + err);
        return;
    }

    if (results.length) {
        for (var i = 0; i < results.length; i++) {
            let keyword = conn.escape(results[i].keyword);
            let id = conn.escape(results[i].keywords_id);
            let info = await rapidApi(keyword);

            if (info) {
                let searchJsonResponse = conn.escape(JSON.stringify(info));
                let datas = info.data;

                function chunkArray(array, size) {
                    var results = [];
                    while (array.length) {
                        results.push(array.splice(0, size));
                    }
                    return results;
                }
                var chunkedData = chunkArray(datas, 6);

                for (let chunk of chunkedData) {
                    let promises = chunk.map(async (data) => {
                        let business_id = data && data.business_id ? conn.escape(data.business_id) : "''";
                        let city = data && data.city ? conn.escape(data.city) : "''";
                        let country = data && data.country ? conn.escape(data.country) : "''";
                        let district = data && data.district ? conn.escape(data.district) : "''";
                        let zip = data && data.zipcode ? conn.escape(data.zipcode) : "''";
                        let address = data && data.address ? conn.escape(data.address) : "''";
                        let full_address = data && data.full_address ? conn.escape(data.full_address) : "''";
                        let name = data && data.name ? conn.escape(data.name) : "''";
                        let descr = data && data.about && data.about.summary ? conn.escape(data.about.summary) : "''";
                        let category = data && data.type ? conn.escape(data.type) : "''";
                        let tags = data && data.subtypes ? conn.escape(data.subtypes.join(",")) : "''";
                        let rating = data && data.rating ? conn.escape(data.rating) : "''";
                        let verified = data && data.verified ? conn.escape(data.verified) : "''";
                        let searchDataJsonResponse = data ? conn.escape(JSON.stringify(data)) : "''";
                        let reviewCount = data && data.review_count ? conn.escape(data.review_count) : "''";
                        let phoneNumber = data && data.phone_number ? conn.escape(data.phone_number) : "''";
                        let website = data && data.website ? conn.escape(data.website) : "''";

                        let detailedData = await getBusinessDetails(business_id);
                        let detailsJsonResponse = conn.escape(JSON.stringify(detailedData));

                        let facebook = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.facebook ? conn.escape(detailedData.data[0].emails_and_contacts.facebook) : "''";

                        let youtube = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.youtube ? conn.escape(detailedData.data[0].emails_and_contacts.youtube) : "''";
                                    
                        let linkedin = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.linkedin ? conn.escape(detailedData.data[0].emails_and_contacts.linkedin) : "''";
                                    
                        let instagram = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.instagram ? conn.escape(detailedData.data[0].emails_and_contacts.instagram) : "''";
                                    
                        let twitter = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.twitter ? conn.escape(detailedData.data[0].emails_and_contacts.twitter) : "''";
                                    
                        let tiktok = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.tiktok ? conn.escape(detailedData.data[0].emails_and_contacts.tiktok) : "''";
                                    
                        let email = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].emails_and_contacts && detailedData.data[0].emails_and_contacts.emails && detailedData.data[0].emails_and_contacts.emails[0] ? conn.escape(detailedData.data[0].emails_and_contacts.emails[0]) : "''";
                                    
                        let monday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Monday && detailedData.data[0].working_hours.Monday[0] ? conn.escape(detailedData.data[0].working_hours.Monday[0]) : "''";
                                    
                        let tuesday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Tuesday && detailedData.data[0].working_hours.Tuesday[0] ? conn.escape(detailedData.data[0].working_hours.Tuesday[0]) : "''";
                                    
                        let wednesday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Wednesday && detailedData.data[0].working_hours.Wednesday[0] ? conn.escape(detailedData.data[0].working_hours.Wednesday[0]) : "''";
                                    
                        let thursday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Thursday && detailedData.data[0].working_hours.Thursday[0] ? conn.escape(detailedData.data[0].working_hours.Thursday[0]) : "''";
                                    
                        let friday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Friday && detailedData.data[0].working_hours.Friday[0] ? conn.escape(detailedData.data[0].working_hours.Friday[0]) : "''";
                                    
                        let saturday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Saturday && detailedData.data[0].working_hours.Saturday[0] ? conn.escape(detailedData.data[0].working_hours.Saturday[0]) : "''";
                                    
                        let sunday = detailedData && detailedData.data && detailedData.data[0] && detailedData.data[0].working_hours && detailedData.data[0].working_hours.Sunday && detailedData.data[0].working_hours.Sunday[0] ? conn.escape(detailedData.data[0].working_hours.Sunday[0]) : "''";

                        return new Promise(async (resolve, reject) => {
                            conn.query(`INSERT INTO places SET keyword = ${keyword}, business_id = ${business_id}, country = ${country}, city = ${city}, district = ${district}, zip = ${zip}, address = ${address}, full_address = ${full_address}, name = ${name}, descr = ${descr}, category = ${category}, tags = ${tags}, rating = ${rating}, review_count = ${reviewCount}, verified = ${verified}, phone_number = ${phoneNumber}, website = ${website}, email = ${email}, facebook = ${facebook}, youtube = ${youtube}, linkedin = ${linkedin}, instagram = ${instagram}, twitter = ${twitter}, tiktok = ${tiktok}, monday = ${monday}, tuesday = ${tuesday}, wednesday = ${wednesday}, thursday = ${thursday}, friday = ${friday}, saturday = ${saturday}, sunday = ${sunday}, searchDataJsonResponse = ${searchDataJsonResponse}, detailsJsonResponse = ${detailsJsonResponse} ON DUPLICATE KEY UPDATE keyword = VALUES(keyword), country = VALUES(country), city = VALUES(city), district = VALUES(district), zip = VALUES(zip), address = VALUES(address), full_address = VALUES(full_address), name = VALUES(name), descr = VALUES(descr), category = VALUES(category), tags = VALUES(tags), rating = VALUES(rating), review_count = VALUES(review_count), verified = VALUES(verified), phone_number = VALUES(phone_number), website = VALUES(website), email = VALUES(email), facebook = VALUES(facebook), youtube = VALUES(youtube), linkedin = VALUES(linkedin), instagram = VALUES(instagram), twitter = VALUES(twitter), tiktok = VALUES(tiktok), monday = VALUES(monday), tuesday = VALUES(tuesday), wednesday = VALUES(wednesday), thursday = VALUES(thursday), friday = VALUES(friday), saturday = VALUES(saturday), sunday = VALUES(sunday), searchDataJsonResponse = VALUES(searchDataJsonResponse), detailsJsonResponse = VALUES(detailsJsonResponse);`, async (err, results) => {
                                if (err) {
                                    console.log("error" + err);
                                    reject(err);
                                } else {
                                    console.log("1 record inseted!");
                                    console.log(`${keyword}, ${business_id}`);
                                    resolve()
                                    totalInserts++;

                                    
                                    if (totalInserts > 70000) {
                                        console.log("Process terminated due to exceeding 70 000 inserts");
                                        conn.end();
                                        process.exit(1);
                                    }

                                }
                            });
                        });
                    });

                    await Promise.all(promises);
                }

                conn.query(`UPDATE keywords SET status = "ok", searchJsonResponse = ${searchJsonResponse} WHERE keywords_id = ${id}`, (err, results) => {
                    if (err) {
                        console.log("error" + err);
                    } else {
                        console.log("Keyword status updated");
                    }
                });
            }
        }
    }
});