const { Schema, model } = require("mongoose");

const gardenSchema = new Schema(
  {
    name: {
      type: String
    },

    description: {
      type: String
    },
    
    height: {
      type: Number,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    direction: {
      type: String,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    current: {
      type: Boolean,
      required: true,
      default: true,
    },

    specimens: [
      {
        type: Schema.Types.ObjectId,
        ref: "Specimen",
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Garden = model("Garden", gardenSchema);

module.exports = Garden;
