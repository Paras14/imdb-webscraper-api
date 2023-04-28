// import express from 'express';
// import request from 'request';
// import puppeteer from 'puppeteer';
const express = require("express")

const app = express();

app.get('/', function(req, res){
    //To be filled
    res.json("Yayyy")
});

app.listen('8080');
console.log('Running http://localhost:8080');
module.exports = app;
