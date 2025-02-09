const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const countries = [];
const states = [];
const cities = []
exports.loadData = (callback) => {
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }

    let count = 0;
    const totalCount = 3;

    fs.createReadStream(path.join(__dirname, '../data/countries.csv'))
        .pipe(csv())
        .on('data', (row) => countries.push(row))
        .on('end', () => {
            count++;
            console.log(`Loaded ${countries.length} countries`);
            if (count === totalCount) callback();
        });

    fs.createReadStream(path.join(__dirname, '../data/states.csv'))
        .pipe(csv())
        .on('data', (row) => states.push(row))
        .on('end', () => {
            count++;
            console.log(`Loaded ${states.length} states`);
            if (count === totalCount) callback();
        });

    fs.createReadStream(path.join(__dirname, '../data/cities.csv'))
        .pipe(csv())
        .on('data', (row) => cities.push(row))
        .on('end', () => {
            count++;
            console.log(`Loaded ${cities.length} cities`);
            if (count === totalCount) callback();
        });
};


exports.getCountries = (req, res) => {
    res.json(countries);
};


exports.getStates = (req, res) => {
    const countryCode = req.query.countryCode;

    if (!countryCode) {
        return res.status(400).json({ error: 'countryCode is required' });
    }

    const filteredStates = states.filter(state => state.country_code === countryCode);

    if (filteredStates.length === 0) {
        return res.status(404).json({ error: `No states found for countryCode: ${countryCode}` });
    }

    res.json(filteredStates);
};


exports.getCities = (req, res) => {
    const stateCode = req.query.stateCode;

    if (!stateCode) {
        return res.status(400).json({ error: 'stateCode is required' });
    }

    const filteredCities = cities.filter(city => city.state_code === stateCode);

    if (filteredCities.length === 0) {
        return res.status(404).json({ error: `No cities found for stateCode: ${stateCode}` });
    }

    res.json(filteredCities);
};