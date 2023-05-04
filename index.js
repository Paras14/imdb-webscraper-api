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
        const advisoryViolence = document.querySelector("#advisory-violence .ipl-zebra-list").innerText.replace("\n", "");
        const advisoryNudity = document.querySelector("#advisory-nudity .ipl-zebra-list").innerText.replace("\n", "");
        const advisoryProfanity = document.querySelector("#advisory-profanity .ipl-zebra-list").innerText.replace("\n", "");
        const advisoryAlcohol = document.querySelector("#advisory-alcohol .ipl-zebra-list").innerText.replace("\n", "");
        const advisoryFrightening = document.querySelector("#advisory-frightening .ipl-zebra-list").innerText.replace("\n", "");
       return { advisoryViolence, advisoryNudity, advisoryProfanity, advisoryAlcohol, advisoryFrightening };
    });
    
    console.log(data.advisoryViolence);

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
