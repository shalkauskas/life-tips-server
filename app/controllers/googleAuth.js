const { OAuth2Client } = require(`google-auth-library`);
const GOOGLE_CLIENT_ID =
  "***REMOVED***";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleAuth = async (token) => {
  console.log("Auth start");
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(`payload:`, payload);

  const { sub, email, name, picture } = payload;
  const userId = sub;
  return { userId, email, fullName: name, photoUrl: picture };
};
module.exports = googleAuth;
