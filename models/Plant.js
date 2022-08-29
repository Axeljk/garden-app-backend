const { Schema, model } = require("mongoose");

const plantSchema = new Schema(
  {
    name: {
      type: String,
    },

    planted: {
      type: Date,
    },

    previousYield: {
      type: Number,
    },

    species: {
        type: Schema.Types.ObjectId,
        ref: "Species",
      },
  },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Plant = model("Plant", plantSchema);

module.exports = Plant;
