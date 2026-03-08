const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Temple = require("./models/Temple");
const Slot = require("./models/Slot");

const temples = require("./data/temples");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {

    // delete old data
    await Temple.deleteMany();
    await Slot.deleteMany();

    // insert temples
    const createdTemples = await Temple.insertMany(temples);

    let slots = [];

    // create slots for each temple
    createdTemples.forEach((temple) => {

      slots.push(
        {
          temple: temple._id,
          poojaType: "Morning Darshan",
          startTime: "06:00",
          endTime: "08:00",
          availableSeats: 50,
          price: 100,
          date: new Date()
        },
        {
          temple: temple._id,
          poojaType: "Special Darshan",
          startTime: "09:00",
          endTime: "11:00",
          availableSeats: 40,
          price: 200,
          date: new Date()
        },
        {
          temple: temple._id,
          poojaType: "Afternoon Darshan",
          startTime: "13:00",
          endTime: "15:00",
          availableSeats: 35,
          price: 150,
          date: new Date()
        },
        {
          temple: temple._id,
          poojaType: "Evening Aarti",
          startTime: "18:00",
          endTime: "20:00",
          availableSeats: 60,
          price: 250,
          date: new Date()
        }
      );

    });

    // insert slots
    await Slot.insertMany(slots);

    console.log("Temples and Slots Imported Successfully!");
    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
};

importData();