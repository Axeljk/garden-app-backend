const { Schema, model, Types } = require("mongoose");
const Mongoose = require("mongoose");

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
	toObject: {
		virtuals: true
	},
    id: false,
  }
);

gardenSchema.pre("save", async function(next) {
	let size = this.width * this.height;
	let defaultID = "63194a3e202ee4e0dcda5af7"; //Mongoose.Types.ObjectId(1);

	if (this.specimens.length < size) {
		for (let i = this.specimens.length; i < size; i++)
			this.specimens.push(defaultID)
	}

	next();
});

const Garden = model("Garden", gardenSchema);

module.exports = Garden;