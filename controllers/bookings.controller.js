// controllers/bookings.controller.js
import { ObjectId } from "mongodb";

let bookingCollection;

export const injectDB = (client) => {
  bookingCollection = client.db("edu_db").collection("bookings");
};

export const addBooking = async (req, res) => {
  const booking = req.body;
  const result = await bookingCollection.insertOne(booking);
  res.send(result);
};

export const getBookings = async (req, res) => {
  const email = req.query.email;
  const query = email ? { userEmail: email } : {};
  const result = await bookingCollection.find(query).toArray();
  res.send(result);
};

export const getAllBookings = async (req, res) => {
  const result = await bookingCollection.find().toArray();
  res.send(result);
};

export const deleteBooking = async (req, res) => {
  const id = req.params.id;
  const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};
