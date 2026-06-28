// One-off script to populate the database with the same sample data that
// previously lived in the frontend as MOCK_REVIEWS. Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Review = require("./models/Review");

const sampleReviews = [
  { guest: "Amara Okafor", room: "Deluxe King", sentiment: "Positive", score: 92, date: "2026-06-18", text: "Staff were incredibly attentive and the room was spotless. Will definitely return for our anniversary next year." },
  { guest: "Liam Chen", room: "Standard Twin", sentiment: "Negative", score: 28, date: "2026-06-17", text: "Air conditioning was broken for two nights and front desk took too long to respond to our calls." },
  { guest: "Priya Sharma", room: "Executive Suite", sentiment: "Neutral", score: 58, date: "2026-06-16", text: "Room was fine, nothing special. Breakfast options were limited compared to last time we stayed." },
  { guest: "Diego Fernandez", room: "Deluxe King", sentiment: "Positive", score: 88, date: "2026-06-15", text: "Loved the view from the balcony and the spa was a great way to unwind after a long flight." },
  { guest: "Hana Kobayashi", room: "Standard Twin", sentiment: "Positive", score: 95, date: "2026-06-14", text: "Best stay we've had this year. Housekeeping went above and beyond every single day." },
  { guest: "Noah Williams", room: "Executive Suite", sentiment: "Negative", score: 34, date: "2026-06-13", text: "Noise from the hallway kept us up most nights and the soundproofing felt non-existent." },
];

const seed = async () => {
  try {
    await connectDB();
    await Review.deleteMany();
    await Review.insertMany(sampleReviews);
    console.log(`Seeded ${sampleReviews.length} reviews successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
