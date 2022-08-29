const { Schema, model } = require("mongoose");

const speciesSchema = new Schema({
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
  timeToBloom: {
    type: Number,
  },
  lifespan: {
    type: Number,
  },
  hardinessZone: {
    type: Number,
  },
  waterNeeded: {
    type: Number,
  },
},

{
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
  );
  const Species = model("Species", speciesSchema);

module.exports = Species;

