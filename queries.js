// queries.js
const { MongoClient } = require("mongodb");
require('dotenv').config();

//  Replace with your MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("plp_bookstore");
    const books = database.collection("books");

    console.log("\n --- MONGO CRUD OPERATIONS ---\n");

    // READ - Get all books
    console.log("1All Books:");
    const allBooks = await books.find({}).toArray();
    console.table(allBooks);

    // 2 READ - Find a book by title
    console.log("\n2 Find One Book (title: 'The Great Gatsby'):");
    const oneBook = await books.findOne({ title: "The Great Gatsby" });
    console.log(oneBook);

    // 3 UPDATE - Update book price
    console.log("\n3Update Book Price (1984):");
    const updateResult = await books.updateOne(
      { title: "1984" },
      { $set: { price: 16.99 } }
    );
    console.log("Matched:", updateResult.matchedCount, "Updated:", updateResult.modifiedCount);

    // 4 DELETE - Remove a book
    console.log("\n4 Delete a Book (title: 'To Kill a Mockingbird'):");
    const deleteResult = await books.deleteOne({ title: "To Kill a Mockingbird" });
    console.log("Deleted:", deleteResult.deletedCount);

    // 5AGGREGATION - Get average price of all books
    console.log("\n5 Aggregation: Average Price of Books");
    const avgPipeline = [
      { $group: { _id: null, avgPrice: { $avg: "$price" } } }
    ];
    const avgPrice = await books.aggregate(avgPipeline).toArray();
    console.log("Average Price:", avgPrice[0]?.avgPrice.toFixed(2));

    // 6 FILTER - Find books cheaper than $20
    console.log("\n6 Books cheaper than $20:");
    const cheapBooks = await books.find({ price: { $lt: 20 } }).toArray();
    console.table(cheapBooks);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
