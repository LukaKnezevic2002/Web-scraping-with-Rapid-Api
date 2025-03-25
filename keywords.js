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

let cities = [
    "Geneva", "Salzburg", "Brno", "Kraków", "Debrecen", "Gothenburg", "Bergen", "Aarhus", "Galway", "Tampere", "Brasov",
    "Marseille", "Florence", "Seville", "Frankfurt", "Manchester", "Sintra", "Mykonos", "Utrecht", "Antwerp", "Lucerne",
    "Innsbruck", "Karlovy Vary", "Poznań", "Szeged", "Malmo", "Trondheim", "Odense", "Cork", "Turku", "Cluj-Napoca",
    "Lyon", "Milan", "Valencia", "Hamburg", "Liverpool", "Faro", "Crete", "The Hague", "Ghent", "Interlaken",
    "Graz", "Olomouc", "Zakopane", "Eger", "Uppsala", "Stavanger", "Aalborg", "Limerick", "Oulu", "Sibiu",
    "Bordeaux", "Naples", "Granada", "Cologne", "Oxford", "Coimbra", "Rhodes", "Maastricht", "Leuven", "Bern",
    "Linz", "Ostrava", "Sopot", "Sopron", "Lund", "Ålesund", "Esbjerg", "Waterford", "Rovaniemi", "Constanta",
    "Strasbourg", "Verona", "Malaga", "Dresden", "Cambridge", "Cascais", "Delphi", "Groningen", "Namur", "Basel",
    "Klagenfurt", "Liberec", "Lublin", "Miskolc", "Visby", "Kristiansand", "Roskilde", "Killarney", "Espoo", "Oradea",
    "Lille", "Turin", "Bilbao", "Heidelberg", "Glasgow", "Lagos", "Corfu", "Eindhoven", "Liege", "Lausanne",
    "Bregenz", "Kiruna", "Narvik", "Frederiksberg", "Dingle", "Vantaa", "Alba Iulia",
    "Avignon", "Bologna", "Cordoba", "Düsseldorf", "York", "Óbidos", "Thessaloniki", "Leiden", "Mechelen", "St. Moritz",
    "Hallstatt", "Kolding", "Kilkenny", "Kuopio",
    "Saint-Tropez", "Pisa", "San Sebastian", "Stuttgart", "Bath", "Nafplio", "Delft", "Mons", "Zermatt", "Bad Ischl",
    "Randers", "Sligo", "Lahti",
    "Cannes", "Genoa", "Zaragoza", "Leipzig", "Brighton", "Haarlem", "Ostend", "Lugano", "St. Anton am Arlberg",
    "Bray"
];
const types = [
    "Archaeological museum",
    "Movie theater",
    "Concert hall",
    "Art gallery",
    "Performing arts theater",
    "History museum",
    "Library",
    "Memorial",
    "Archaeological museum",
    "Memorial park",
    "Mosque",
    "Science museum",
    "Museum of zoology",
    "Modern art museum",
    "Ballet theater",
    "Natural history museum",
    "History museum",
    "National park",
    "Catholic church",
    "Technology museum",
    "Zoo",
    "Art gallery",
    "Drama theater",
    "Historical landmark",
    "Art museum",
    "Animal park",
    "Christian church",
    "Aquarium",
    "Art museum",
    "Modern art museum",
    "Museum",
    "National museum",
    "Technology museum"
];
let keywords = [];

cities.forEach((city) => {
    types.forEach((type) => {
        keywords.push(type + " in " + city);
    });
});

keywords.forEach((keyword) => {
    conn.query("SELECT * FROM KEYWORDS WHERE keyword = ?", keyword, (err, results) => {
        if (err) {
            console.log("Error fetching data: " + err);
        } else if (results.length === 0) {
            conn.query("INSERT INTO KEYWORDS SET keyword = ?", keyword, (err, result) => {
                if (err) {
                    console.log("Error inserting data: " + err);
                } else {
                    console.log(keyword + " inserted");
                }
            });
        } else {
            console.log(keyword + " already exists, skipping insertion");
        }
    });
});