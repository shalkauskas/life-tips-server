module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      content: String,
      published: Boolean,
      author: String,
      userId: String,
      rating: Number,
      time: String,
    },
    { timestamps: true }
  );
  schema.index({ "$**": "text" });
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  // define a collection in db
  const Joke = mongoose.model("joke", schema);
  return Joke;
};
