// controllers/services.controller.js
import { ObjectId } from "mongodb";

let eduServiceCollection;

export const injectDB = (client) => {
  eduServiceCollection = client.db("edu_db").collection("services");
};

export const addService = async (req, res) => {
  const service = req.body;
  const result = await eduServiceCollection.insertOne(service);
  res.send(result);
};

export const getServices = async (req, res) => {
  const result = await eduServiceCollection.find().limit(6).toArray();
  res.send(result);
};

export const getAllServices = async (req, res) => {
  const result = await eduServiceCollection.find().toArray();
  res.send(result);
};

export const searchServices = async (req, res) => {
  const { searchParams } = req.query;
  const query = searchParams
    ? {
        $or: [
          { serviceName: { $regex: searchParams, $options: "i" } },
          { description: { $regex: searchParams, $options: "i" } },
        ],
      }
    : {};
  const result = await eduServiceCollection.find(query).toArray();
  res.send(result);
};

export const getUserServices = async (req, res) => {
  const email = req.params.email;
  if (req.user.email !== email) return res.status(403).send({ message: "Forbidden Access" });

  const query = { "serviceProviderData.email": email };
  const result = await eduServiceCollection.find(query).toArray();
  res.send(result);
};

export const getServiceById = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await eduServiceCollection.findOne(query);
  res.send(result);
};

export const updateService = async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await eduServiceCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );
  res.send(result);
};

export const deleteService = async (req, res) => {
  const id = req.params.id;
  const result = await eduServiceCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};
