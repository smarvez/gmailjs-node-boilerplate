"use strict";

console.log("Extension loading...");
const jQuery = require("jquery");
const $ = jQuery;
const moment = require('moment');
const GmailFactory = require("gmail-js");
const gmail = new GmailFactory.Gmail($);
window.gmail = gmail;

//declare variables for trackingId, recipients, subject, and date
const trackingId = 'UA-117509256-1';
var recipients = [];
var subject = '';
const date = moment().format('L');

//verify extension is working correctly
gmail.observe.on("load", () => {
  const userEmail = gmail.get.user_email();
  console.log("Hello, " + userEmail + ". This is your extension talking!");
});

//add pixel to outgoing emails for tracking and add proxy links
gmail.observe.before('send_message', function(url, body, data, xhr){

  var body_params = xhr.xhrParams.body_params;
  console.log(body_params);
  var body = body_params.body
  if(body.includes("https://")){
    let message = body.split('href="https://').join('href="https://proxy.playposit.com/ssl/');
    body = message;
  }
  if(body.includes("http://")){
    let message = body.split('href="http://').join('href="https://proxy.playposit.com/http/');
    body = message;
  }
  console.log("body", body);

  //capture recipients, subject
  body_params.to.forEach(el => {
    recipients.push(el);
  })
  subject = body_params.subject;

  addPixel();
});

//clear email data after send
gmail.observe.after('send_message', function() {
  clear();
})

//function to add pixel once email is sent
function addPixel(){
  let pixel = document.createElement('img');
  pixel.id = 'tracking-pixel';
  pixel.src = `https://www.google-analytics.com/collect?v=1&tid=${trackingId}&cid=CLIENT_ID&t=event&ec=email&ea=open&el=${subject}_on_${date}_to_${recipients}&cs=newsletter&cm=email&cn=Campaign_Name`;
}

//clear email data
function clear(){
  recipients = [];
  subject = '';
}
