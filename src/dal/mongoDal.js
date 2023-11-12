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
  static async postData(data, modal) {
    try {
      console.log("request received" + JSON.stringify(data));
      let res = await modal.create(data);
      return {
        statusCode: 201,
        body: {
          message: "records inserted successfully",
          data: res,
        },
      };
    } catch (error) {
      console.log("error occourred in catch block", error.message);
      return {
        statusCode: 404,
        body: {
          message: error.message,
        },
      };
    }
  }

  static async getData(modal, queryParam) {
    try {
      const data = await modal.find(queryParam).sort('-createdAt');
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
      console.log("error occurred while fetching data from mongo", error.message);
      return {
        statusCode: 404,
        body:{
          message: error.message
        }
      }
    }
  }

  static async deleteData(modal, queryParam) {
    try {
      const data = await modal.findOneAndRemove(queryParam);
      if (!data) {
        return {
          statusCode: 204,
          body: {
            message: "no record found for this queryParam"
          },
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
      console.log("error occurred while deleting data from mongo", error.message);
      return {
        statusCode: 404,
        body:{
          message: error.message
        }
      }
    }
  }

  static async updateData(update, modal , queryParam) {
    try {
      const data = await modal.findOneAndUpdate(queryParam, update, {
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
      console.log("error occurred while updating data from mongo", error.message);
      return {
        statusCode: 404,
        body: {
          message: error.message
        }
      }
    }
  }
}

module.exports = mongoDal;
