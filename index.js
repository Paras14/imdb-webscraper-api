// import express from 'express';
// import request from 'request';
// import puppeteer from 'puppeteer';
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
// const webScrap = require("./webScrap");
// import { run } from './webScrap.js';

const app = express();

app.use(cors())

async function run(movieID) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage({
        headless: true
    });
    await page.goto(`https://www.imdb.com/title/${movieID}/parentalguide`, {
        waitUntil: "domcontentloaded",
    });

    const data = await page.evaluate(() => {
        //This is to create a nodelist without the severity vote list item, document.querySelectorAll("#advisory-violence .ipl-zebra-list__item:not(.advisory-severity-vote__container)")
        //Array.prototype.map.call() takes two arguments, one is nodelist, other one is the mapping function
        const advisoryViolence = Array.prototype.map.call(document.querySelectorAll("#advisory-violence .ipl-zebra-list__item:not(.advisory-severity-vote__container)"), item => item.innerText);
        const advisoryNudity = Array.prototype.map.call(document.querySelectorAll("#advisory-nudity .ipl-zebra-list__item:not(.advisory-severity-vote__container)"), item => item.innerText);
        const advisoryProfanity = Array.prototype.map.call(document.querySelectorAll("#advisory-profanity .ipl-zebra-list__item:not(.advisory-severity-vote__container)"), item => item.innerText);
        const advisoryAlcohol = Array.prototype.map.call(document.querySelectorAll("#advisory-alcohol .ipl-zebra-list__item:not(.advisory-severity-vote__container)"), item => item.innerText);
        const advisoryFrightening = Array.prototype.map.call(document.querySelectorAll("#advisory-frightening .ipl-zebra-list__item:not(.advisory-severity-vote__container)"), item => item.innerText);
       return { advisoryViolence, advisoryNudity, advisoryProfanity, advisoryAlcohol, advisoryFrightening };
    });
    
    data.advisoryViolence.forEach(element => {
        console.log("-> "+element + "\n");
    });

    await browser.close();

    return data;
}

// run();

app.get('/scrap', async function(req, res){
    //To be filled
    const { movieID } = req.query;
    const data = await run(movieID);
    res.status(200).json({data})
});

app.listen('8080');
console.log('Running http://localhost:8080');
module.exports = app;
