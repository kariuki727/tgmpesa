const { Telegraf, Markup } = require('telegraf');
const {
  isMpesaNumber,
  requestSTKPush
} = require('./mpesa');
const {
  isMemberActive,
  getMemberExpiry
} = require('./membership');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Track user state
const userStates = {};

bot.start((ctx) => {
  const welcome = `👋 Welcome to TMT PREMIUM Bot!

Use this bot to subscribe to our exclusive content.

Choose a plan below to get started:`;

  ctx.reply(welcome, Markup.inlineKeyboard([
    [Markup.button.callback('📅 1 Day - KES 100', 'plan_1')],
    [Markup.button.callback('🗓 1 Week - KES 300', 'plan_7')],
    [Markup.button.callback('📆 1 Month - KES 500', 'plan_30')]
  ]));
});

bot.command('help', (ctx) => {
  ctx.reply(`🆘 For help, please contact:

👤 @itskvo  
👤 @bricekasupport`);
});

bot.command('status', (ctx) => {
  const chatId = ctx.chat.id;

  if (isMemberActive(chatId)) {
    const expiry = new Date(getMemberExpiry(chatId));
    ctx.reply(`✅ Your membership is active.\nExpires on: ${expiry.toLocaleString()}`);
  } else {
    ctx.reply('⛔ Your membership is inactive or expired.\nPlease subscribe again using /start.');
  }
});

bot.command('getgroupid', (ctx) => {
  if (ctx.chat.type.includes('group')) {
    ctx.reply(`Group ID: ${ctx.chat.id}`);
  } else {
    ctx.reply('❌ This command must be used in a group.');
  }
});

// Handle plan selection
bot.action(/plan_(\d+)/, async (ctx) => {
  const days = parseInt(ctx.match[1]);
  const prices = { 1: 100, 7: 300, 30: 500 };
  const price = prices[days];
  const expiry = new Date(Date.now() + days * 86400000);

  await ctx.answerCbQuery(); // Remove loading spinner
  await ctx.reply(`💳 You selected:\nDuration: ${days} day(s)\nAmount: KES ${price}\nExpires on: ${expiry.toLocaleString()}`);

  await ctx.reply('📱 Please enter your M-PESA number to proceed (e.g., 0712..., 2547..., +2547...):');
  userStates[ctx.chat.id] = { step: 'awaiting_phone', days };
});

// Handle phone number input
bot.on('text', async (ctx) => {
  if (ctx.chat.type !== 'private') return;

  const state = userStates[ctx.chat.id];
  const phone = ctx.message.text.trim();

  if (state?.step === 'awaiting_phone') {
    if (!isMpesaNumber(phone)) {
      return ctx.reply('❌ Invalid M-PESA number format. Please enter a valid number starting with 07, 01, 2547 or +2547.');
    }

    try {
      await ctx.reply('📤 Sending payment request to your phone...');
      await requestSTKPush(phone, state.days, ctx.chat.id);
      ctx.reply('✅ STK push sent. Please check your phone and enter your M-PESA PIN to complete payment.');
    } catch (err) {
      console.error('MPESA error:', err.response?.data || err.message);
      ctx.reply('❌ Failed to initiate payment. Please try again or contact support with /help.');
    }

    delete userStates[ctx.chat.id];
  }
});

module.exports = bot;
