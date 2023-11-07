const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT | 8000;


let newsSites = [
    {
        name: 'nyt',
        url: 'https://www.nytimes.com/international/section/climate',
        base: ''
    },
    {
        name: 'thetimes',
        url: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        url: 'https://www.theguardian.com/international',
        base: '',
    }
]

let articals = [];


newsSites.forEach(newsSite => {
    axios.get(newsSite.url)
        .then( response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {

                const title = $(this).text();
                const url = $(this).attr('href');
                articals.push({
                    title,
                    url: newsSite.base + url,
                });
            })

        })
        .catch(error => console.log(error));

})


app.get('/news', (req, res) => {
    res.json(articals);
})

app.get('/news/:specificNewsSite', (req, res) => {
    const specificNewsSite = req.params.specificNewsSite;

    const siteUrl = newsSites.filter(site => site.name == specificNewsSite)[0].url;
    let specificSite = [];
    

    axios.get(siteUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                specificSite.push({
                    title,
                    url
                }
                )

            })
            res.json(specificSite)
        })
        .catch(error => console.log(error));

})






app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`);
})