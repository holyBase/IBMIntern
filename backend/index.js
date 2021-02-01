const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 5000;
const api_url = 'https://opendata.ecdc.europa.eu/covid19/nationalcasedeath/json/';

const data = [];


app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, this is API endpoint');
})

app.get('/getAllCountries', (req, res) => {
    let allCountry = [];
    for (let i = 0; i < data.length; i++) {
        if (!allCountry.includes(data[i].country)) {
            allCountry.push(data[i].country);
        }
    }
    res.status(200).json({ data: allCountry });
});


app.get('/:country', async (req, res) => {
    const { country } = req.params;
    const foundCountry = data.filter(data => data.country === country);
    if (foundCountry) {
        res.status(200).json({
            data: foundCountry.map(data => ({
                country: data.country,
                indicator: data.indicator,
                weekly_count: data.weekly_count,
                year_week: data.year_week
            }))
        });
    } else {
        res.status(500).json({ data: 'Something went wrong' });
    }
});


getData = async () => {
    try {
        console.log('Getting data...');
        const response = await axios.get(api_url);
        for (let i = 0; i < response.data.length; i++) {
            data.push(response.data[i]);
        }
        console.log('Data get successfully');
    } catch (error) {
        console.error(error);
    }
};


app.listen(PORT, () => console.log(`Server running on port: http://localhost: ${PORT}`));
getData();