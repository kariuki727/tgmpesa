const fs = require('fs');
const path = './members.json';

function loadMembers() {
  try {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.error("Error reading members file:", err);
    return {};
  }
}

function saveMembers(members) {
  try {
    fs.writeFileSync(path, JSON.stringify(members, null, 2));
  } catch (err) {
    console.error("Error saving members file:", err);
  }
}

function addMember(chatId, days) {
  const members = loadMembers();
  const now = new Date();
  const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  members[chatId] = expiry.toISOString();
  saveMembers(members);
  return expiry;
}

function isMemberActive(chatId) {
  const members = loadMembers();
  if (!members[chatId]) return false; // If no expiry exists for the user, return false
  const expiry = new Date(members[chatId]);
  return expiry > new Date();
}

function getMemberExpiry(chatId) {
  const members = loadMembers();
  return members[chatId] || null;
}

function removeMember(chatId) {
  const members = loadMembers();
  delete members[chatId];
  saveMembers(members);
}

module.exports = {
  addMember,
  isMemberActive,
  getMemberExpiry,
  removeMember,
};
