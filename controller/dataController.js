const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const countries = [];
const states = [];
const cities = [];

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
            if (count === totalCount) {
                callback();
            }
        });

    fs.createReadStream(path.join(__dirname, '../data/states.csv'))
        .pipe(csv())
        .on('data', (row) => states.push(row))
        .on('end', () => {
            count++;
            console.log(`Loaded ${states.length} states`);
            if (count === totalCount) {
                callback();
            }
        });

    fs.createReadStream(path.join(__dirname, '../data/cities.csv'))
        .pipe(csv())
        .on('data', (row) => cities.push(row))
        .on('end', () => {
            count++;
            console.log(`Loaded ${cities.length} cities`);
            if (count === totalCount) {
                callback();
            }
        });
};

exports.getData = (req, res) => {
    console.log('Rendering dropdown with:', { 
        countriesCount: countries.length, 
        statesCount: states.length, 
        citiesCount: cities.length 
    });
    res.render('dropdown', { countries, states , cities});
};



exports.getCities = (req, res) => {
    const stateCode = req.query.stateCode;
    const filteredCities = cities.filter(city => city.state_code === stateCode);
    res.json(filteredCities);
};