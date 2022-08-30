const { Schema, model } = require("mongoose");

const layoutSchema = new Schema(
  {
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

    plants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plant",
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

const Layout = model("Layout", layoutSchema);

module.exports = Layout;
