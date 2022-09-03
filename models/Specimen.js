const { Schema, model } = require("mongoose");

const specimenSchema = new Schema(
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
    
    userNotes: {
      type: String
    },

    plant: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
      },

  },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Specimen = model("Specimen", specimenSchema);

module.exports = Specimen;
