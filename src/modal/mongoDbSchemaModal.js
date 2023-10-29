const validator  = require('validator');
const mongoose = require('mongoose');


class schema{

    static async notesSchema(){
        const notesSchema = {
            title: {
                type: String,
                required: [true, 'plz enter the title'],
                unique: true
            },
            description:{
                type: String,
                required: [true, 'plz provide the description']
            }
        }
        const schemaObject = new mongoose.Schema(notesSchema);
        return schemaObject;

    }
}

module.exports = schema;