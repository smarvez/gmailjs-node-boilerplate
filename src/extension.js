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
const recipients = [];
const subject = '';
const date = moment().format('L');

//verify extension is working correctly
gmail.observe.on("load", () => {
  const userEmail = gmail.get.user_email();
  console.log("Hello, " + userEmail + ". This is your extension talking!");
});

//add pixel to outgoing emails for tracking
gmail.observe.before('send_message', function(url, body, data, xhr){
  addPixel();

  var body_params = xhr.xhrParams.body_params;
  console.log(body_params);
});

//function to add pixel once email is sent
function addPixel(){
  let pixel = document.createElement('img');
  pixel.id = 'tracking-pixel';
  pixel.src = `http://www.google-analytics.com/collect?v=1&tid=${trackingId}&cid=CLIENT_ID&t=event&ec=email&ea=open&el=${subject}_on_${date}_to_${recipients}&cs=newsletter&cm=email&cn=Campaign_Name`;
}

// gmail.observe.on("compose", () => {
//   console.log(gmail.dom.compose())
  // let id = gmail.get.email_id();
  // console.log("this is the id", id);

  // let email = new gmail.dom.email();
  // let body = gmail.dom.email('body');
  // // console.log(email);
  // gmail.dom.email.body('<h1>My New Heading!</h1>' + body);
  // console.log(gmail.dom.email);
// })


// gmail.observe.after("send_message", function(url, body, data, xhr) {
//   console.log("this is happening");
//   console.log("url:", url, 'body', body, 'email_data', data, 'xhr', xhr);
// })
