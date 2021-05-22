const express = require("express");
express.static.mime.define({'application/json': ['json', 'abi']});
const app = express();


app.use(express.static("."))
app.use("/abi", express.static("../bin/contracts/", {
    setHeaders: function(res, requestPath) {
        res.set('Content-Type', "application/json");
    }
}));

app.listen(3000, () => {
    console.log("Listening on port 3000");
});