const utils = require("../utils/utils");
const mongoose = require("mongoose");
const mongoDbUrl = process.env.MONGO_DATABASE.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(
    mongoDbUrl,
    {
      dbName: process.env.DATABASE_NAME,
    },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => {
    console.log("connection made successfully");
  })
  .catch((err) => {
    console.log(err.message);
    console.log("error while connecting database");
  });

class mongoDal {
  static async postData(data, collectionName, schema) {
    try {
      console.log("request received" + data);
      let Note =
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, schema);
      const parsedData = await utils.parseElement(data);
      let res = await Note.create(parsedData);
      return {
        statusCode: 201,
        body: {
          message: "records inserted successfully",
          data: res,
        },
      };
    } catch (error) {
      console.log("error occourred in catch block", error.statusCode);
      return {
        statusCode: 404,
        body: {
          message: error.message,
        },
      };
    }
  }

  static async getData(collectionName, schema, queryParam) {
    try {
      let NoteData =
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, schema);
      const data = await NoteData.find(queryParam);
      // console.log(data);
      if (data.length == 0) {
        return {
          statusCode: 204,
          body: "records not found",
        };
      }
      return {
        statusCode: 200,
        body: {
          message: "records fetched successfully",
          data,
        },
      };
    } catch (error) {
      console.log("error occurred while fetching data from mongo", error.code);
      throw error;
    }
  }

  static async deleteData(collectionName, schema, queryParam) {
    try {
      let NoteData =
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, schema);
      console.log(queryParam);
      if (!queryParam.title) {
        return {
          statusCode: 203,
          body: {
            message: "queryParam is missing",
          },
        };
      }
      const data = await NoteData.findOneAndRemove(queryParam);
      console.log(data);
      if (!data) {
        return {
          statusCode: 204,
          body: "no record found for this queryParam",
        };
      }
      return {
        statusCode: 200,
        body: {
          message: "record removed",
          data,
        },
      };
    } catch (error) {
      console.log("error occurred while deleting data from mongo", error.code);
      throw error;
    }
  }

  static async updateData(update, collectionName, schema, queryParam) {
    try {
      let NoteData =
        mongoose.models[collectionName] ||
        mongoose.model(collectionName, schema);
      console.log(queryParam);
      console.log("update", update);
      if (!queryParam.title) {
        return {
          statusCode: 203,
          body: {
            message: "queryParam is missing",
          },
        };
      }
      const parsedData = await utils.parseElement(update);
      const data = await NoteData.findOneAndUpdate(queryParam, parsedData, {
        returnOriginal: false,
      });
      return {
        statusCode: 201,
        body: {
          message: "record updated",
          data,
        },
      };
    } catch (error) {
      console.log("error occurred while updating data from mongo", error.code);
      throw error;
    }
  }
}

module.exports = mongoDal;
