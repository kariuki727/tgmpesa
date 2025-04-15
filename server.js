require('dotenv').config();
const express = require('express');
const bot = require('./index');
const { getMemberExpiry, isMemberActive } = require('./membership');

const app = express();
app.use(express.json());

// Telegram webhook
app.post('/telegram-webhook', (req, res) => {
  try {
    bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error('Error handling Telegram webhook:', err);
    res.sendStatus(500);
  }
});

// Mpesa callback
app.post('/mpesa-callback', async (req, res) => {
  const body = req.body?.Body?.stkCallback;

  if (body?.ResultCode === 0) {
    const phone = body.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber').Value;
    const amount = body.CallbackMetadata.Item.find(i => i.Name === 'Amount').Value;
    console.log(`✅ Payment confirmed from ${phone} - Amount: KES ${amount}`);

    // Example: Find the corresponding Telegram chatId from phone number (mapping needed)
    // You can link the phone number to the Telegram user somehow
    const chatId = await findChatIdByPhoneNumber(phone);  // Implement this function to find chatId

    if (chatId) {
      // Add the user to the membership if they are not already active
      if (!isMemberActive(chatId)) {
        // Add member and set expiry date
        const expiry = await addMember(chatId, 30);  // Example: Add 30-day membership
        bot.telegram.sendMessage(chatId, `✅ Your payment was successful!\nYour membership is active and will expire on ${new Date(expiry).toLocaleString()}. Enjoy your premium access!`);
      } else {
        bot.telegram.sendMessage(chatId, `✅ Your membership is already active!\nExpires on: ${new Date(getMemberExpiry(chatId)).toLocaleString()}`);
      }
    } else {
      console.log('Chat ID not found for the phone number:', phone);
    }

  } else {
    const phone = body.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber').Value;
    const errorMessage = body?.ResultDesc || 'Unknown error';
    console.log(`❌ Payment failed from ${phone}: ${errorMessage}`);

    // Inform the user about the failed payment and alternative manual payment
    const chatId = await findChatIdByPhoneNumber(phone);  // Retrieve chatId from phone
    if (chatId) {
      bot.telegram.sendMessage(chatId, `❌ Your payment was not successful.\nPlease follow the instructions below to complete your subscription:\n\n1. Pay via Paybill: \n   - Paybill Number: 247247 \n   - Account Number: 565291 \n\n2. Once payment is done, please DM @bricekasupport with your payment confirmation to get the exclusive join link.\n\nAlternatively, you can try the payment again.`);
    } else {
      console.log('No chatId found for failed payment phone number:', phone);
    }
  }

  res.sendStatus(200); // Respond back to Mpesa API that we processed the callback
});

// Function to find the Telegram chatId by phone number (implement this logic to map the phone number to Telegram)
async function findChatIdByPhoneNumber(phone) {
  const members = await loadMembers(); // Load members from your database or JSON
  // You will need to implement logic to map phone numbers to chatId (if stored during payment initiation)
  const member = Object.keys(members).find(chatId => members[chatId]?.phone === phone);
  return member || null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot server running on port', PORT);
});
