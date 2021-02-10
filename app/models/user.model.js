const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
module.exports = (mongoose) => {
  var userSchema = mongoose.Schema(
    {
      username: String,
      password: String,
      googleId: String,
      displayName: String,
      photoUrl: String,
    },
    { timestamps: true }
  );
  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
  userSchema.index({ "$**": "text" });
  userSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  // define a collection in db
  const User = mongoose.model("user", userSchema);
  return User;
};
