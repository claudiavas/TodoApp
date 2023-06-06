const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema = new Schema({
    taskName: { 
      type: String, 
      required: true,
      unique: true
      },
    
    tag: { 
      type: String,
      },

    description: { 
      type: String,
      },
    
    dueDate: { 
      type: Date,
      },
      
    status: {
      // status también podría ser type: ObjectId sobre todo si los estados van a tener otras propiedades como por ejemplo el color, idioma, etc. A la larga es más escalable. 
      type: String,
      //required: true,
      default: "PENDING",
      enum: ["COMPLETED", "IN PROGRESS", "PENDING", "POSTPONED", "DELETED"]
      },
    
    deletedAt: Date
 
  },
   {timestamps:true}
  );
  
  module.exports = mongoose.model("Tasks", taskSchema);