const { Schema, model } = require("mongoose");

const plantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String
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
  },
  imgLink :{
    type: String,
    default: "https://upload.wikimedia.org/wikipedia/commons/3/31/Diversity_of_plants_%28Streptophyta%29_version_2.png"
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

