const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
{
temple: {
type: mongoose.Schema.Types.ObjectId,
ref: "Temple",
required: true
},

poojaType: {
type: String,
required: true
},

startTime: {
type: String,
required: true
},

endTime: {
type: String,
required: true
},

availableSeats: {
type: Number,
default: 50
},

price: {
type: Number,
default: 100
},

date: {
type: Date,
required: true
}

},
{ timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);