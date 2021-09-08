const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
var cors = require('cors');
const PORT = process.env.PORT || 4000


var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  };


app.get('/',cors(corsOptions),(req,res,next) => {
       
    let site = req.query.site;
    site = `https://sownloader.com/index.php?url=${req.query.site}#support-sownloader`;

    function URLToArray(url) {
        var request = {};
        var pairs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            if(!pairs[i])
                continue;
            var pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
         }
         return request;
    }
    

    if(req.query.site != undefined){
        request(site, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            let data = [];
            $('.top-buffer a').each(function(i, element){
                let ttt = $(this).attr('href');    
                data.push({
                        name:$(this).text(),
                        src:URLToArray(ttt).url,
                    })
            });
            res.send(data);
           }
     });
    }else{
        res.send({"error":"Required URL."})
    }
});


app.listen(PORT,() => {
    console.log(`App is listening on Port http::/localhost:${PORT}`)
})
