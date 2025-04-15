const axios = require('axios');
require('dotenv').config();

async function generateToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const res = await axios.get(url, {
    headers: {
      Authorization: `Basic ${credentials}`
    }
  });

  return res.data.access_token;
}

function isMpesaNumber(number) {
  return /^(\+?254|0)?7\d{8}$/.test(number) || /^(\+?254|0)?1\d{8}$/.test(number);
}

async function requestSTKPush(phone, days, chatId) {
  const accessToken = await generateToken();

  const amount = days === 1 ? 100 : days === 7 ? 300 : days === 30 ? 500 : 0;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackURL = process.env.MPESA_CALLBACK_URL;

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: formatPhone(phone),
    PartyB: shortcode,
    PhoneNumber: formatPhone(phone),
    CallBackURL: callbackURL,
    AccountReference: chatId.toString(),
    TransactionDesc: `TMT Premium - ${days} days`
  };

  const url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return res.data;
}

function formatPhone(number) {
  number = number.replace(/\s+/g, '');

  if (number.startsWith('+254')) return number.replace('+', '');
  if (number.startsWith('0')) return '254' + number.slice(1);
  if (number.startsWith('254')) return number;

  throw new Error('Invalid phone format');
}

module.exports = {
  isMpesaNumber,
  requestSTKPush,
};
