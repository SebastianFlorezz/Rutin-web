const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000



app.listen(PORT, (error) =>{
    if(error){
        console.error("Error launching the server.", error)
    }

    console.log(`Server running on http://localhost:${PORT}/`)

})