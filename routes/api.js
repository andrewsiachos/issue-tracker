/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(process.env.MONGO_URI);



var issueSchema = new Schema({
  title:String,
  text:String,
  creator:String,
  assigned_to:String,
  status_text:String,
  created_on:String,
  updated_on:String,
  open:Boolean 
  
});

var Issues = mongoose.model("Issues", issueSchema);


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      res.send(project);
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var theTitle = req.body.issue_title;
      var theText = req.body.issue_text;
      var creator = req.body.created_by;
      var assignedTo = req.body.assigned_to;
      var statusText = req.body.status_text;
      var date = new Date();
      
      Issues.findOne({title:theTitle}, (error, data)=>{
        if(error){
          res.send("Error reading database");
        }else{
          if(data==null){
            
            
            var newData = new Issues({
              title:theTitle,
              text:theText,
              creator:creator,
              assigned_to:assignedTo,
              status_text:statusText,
              created_on:date,
              open:true
            });
            newData.save((err)=>{
              if(err){
                res.send("Error saving to database.");
              }
            });
            
            res.json({title:theTitle, text:theText, created_by:creator, assigned_to:assignedTo,status_text:statusText,created_on:date, open:true});
            
            
            
          }else{
            res.json({message:"Issue already exists. Please refer to the update form."});
          }
        }
      });
      
      
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var idInput = req.body._id;
      var newTitle = req.body.issue_title;
      var newText = req.body.issue_text;
      var newCreator = req.body.created_by;
      var assignedTo = req.body.assigned_to;
      var statusText= req.body.status_text;
      var date = new Date();
    
      Issues.findById(idInput, (err, doc)=>{
        if(err){
          res.json({message:'no issue with that id'});
        }else{
          
          if(doc.open == false){
            res.json({'message':'issue is closed'});
          }else{
            if(req.body.open == 'false'){
              doc.title = newTitle;
              doc.text = newText;
              doc.creator = newCreator;
              doc.assigned_to = assignedTo;
              doc.status_text = statusText;
              doc.updated_on = date;
              doc.open = false;
              
              doc.save((error)=>{
                res.send("error updating database");
              });
              res.json({id:idInput, title:newTitle, text:newText, creator:newCreator, assigned_to:assignedTo, status_text:statusText,updatedOn:date, open:false});
              
            }else{
              doc.title = newTitle;
              doc.text = newText;
              doc.creator = newCreator;
              doc.assigned_to = assignedTo;
              doc.status_text = statusText;
              doc.updated_on = date;
              
              doc.save((error)=>{
                res.send("error updating database");
              });
              res.json({id:idInput, title:newTitle, text:newText, creator:newCreator, assigned_to:assignedTo, status_text:statusText,updatedOn:date, open:false});
            }
          }
          
          
        }
      });
      
      
    
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var deleteId = req.body._id;
      Issues.findByIdAndDelete(deleteId);
    });
    
};
