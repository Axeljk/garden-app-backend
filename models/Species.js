const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  grownHeight: {
    type: Number,
  },
  grownWidth: {
    type: Number,
  },
  harvestBloomDate: {
    type: Date,
  },
  lifespan: {
    type: Number,
  },
  hardinessZone: {
    type: String,
  },
  waterNeeded: {
    type: String,
  },
  lightRequirement: {
    type: String,
  },
  soilType: {
    type: String
  },
  userNotes: {
    type: String
  }
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

