const fs = require("fs/promises");
const path = require("path");

exports.fetchEndpoints = () => {
    return fs
    .readFile(path.resolve(__dirname, "../endpoints.json"))
}
