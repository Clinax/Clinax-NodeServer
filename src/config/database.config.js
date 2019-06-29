var m = require('mongoose');

export const url = 'mongodb://localhost:27017/clinic-database';

m.Promise = global.Promise;
// FIX for: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
m.set('useCreateIndex', true);
// Connecting to the database
m.connect(url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database: ", url);
}).catch(err => {
    console.error('Could not connect to the database[' + url + ']. Exiting now...', err);
    process.exit();
});

export const mongoose = m;