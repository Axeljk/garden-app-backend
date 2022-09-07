const { Schema, model } = require("mongoose");

const specimenSchema = new Schema(
  {
    name: {
      type: String,
	  required: true
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
		required: true
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
