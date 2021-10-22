module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "start",
      description: "Submit a referral",
      channels: ['private'],
      hidden: true,
      adminOnly: false
    };
  }

  async findRef(uid, refToken) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');

    // Check if we have an existing user reference
    const existing = await userRefs.find({ referenceToken: refToken }).toArray();
    if (existing.length === 0) return null;

    // Check if the referral has already had this user referred
    const referral = existing.shift();
    const existingUserRef = (referral.referrals || []).find((ref) => ref.userId === uid);
    if (existingUserRef) return referral;

    // Add this user to the referral
    const newReferrals = [
      ...referral.referrals,
      {
        userId: uid,
        referralTime: +new Date(),
        messageCount: 0
      }
    ];

    await userRefs.updateOne(
      { referenceToken: refToken },
      { $set: { referrals: newReferrals }},
      { returnOriginal: true }
    );
    
    return { ...referral, referrals: newReferrals };
  }

  async run(msg, args) {
    const token = args.shift() || null;
    if (!token) return;

    // User joined via referral
    const ref = await this.findRef(msg.from.id, token);
    this.bot.sendMessage(
      msg.chat.id,
      `You have been referred to Flavors BSC by @${ref.userName}.\n\nYou can now join the Telegram by clicking the link below:\n${this.bot.config['links']['group']}`
    );
  }
};
