const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');


const dbSource = 'todo.db';
const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8000;

var app = express();
app.use(cors());


//create new user
app.post('/users', (req, res, next) => {
    let arrParams = [req.query.UserID, req.query.Email, req.query.Password, req.query.First, req.query.Last];

    let strCommand = "INSERT INTO tblUsers VALUES(?, ?, ?, ?, ?)";
    if(arrParams[0] && arrParams[1] && arrParams[2] && arrParams[3] && arrParams[4]) {


        bcrypt.hash(arrParams[2], 10).then(hash => {
            arrParams[2] = hash;
            db.run(strCommand,arrParameters,function(err,result){
                if(err){
                    res.status(400).json({error:err.message})
                } else {
                    res.status(201).json({
                        message:"success",
                        email:strEmail
                    })
                }
            })
        })


    } else {
        res.status(400).json({error: 'Parameters not provided'});
    }
})


// Create new session
app.post("/sessions", (req,res,next) => {
    let strUserID = req.query.UserID;
    let strPassword = req.query.Password;
    let strSessionID = uuidv4();
    if(strUserID && strPassword){
        bcrypt.hash(strPassword, 10).then(hash => {
            strPassword = hash;
            let strCommand = "SELECT * FROM tblUsers WHERE UserID = ? AND Password = ?";
            let arrParameters = [strUserID,strPassword, "CURRENT_TIMESTAMP"];
            db.all(strCommand,arrParameters,function(err,result){
                if(result.length > 0){
                    strCommand = "INSERT INTO tblSessions VALUES(?,?)";
                    arrParameters = [strSessionID,strUserID];
                    db.run(strCommand,arrParameters,function(err,result){
                        if(err){
                            res.status(400).json({error:err.message})
                        } else {
                            res.status(201).json({
                                message:"success",
                                sessionid:strSessionID
                            })
                        }
                    })
                }
            })
            
        })
    } else {
        res.status(400).json({error:"Not all parameters provided"})
    }
})


// Get session
app.get('/sessions', (req, res, next) => {
    arrParams = [req.query.UserID];
    let strCommand = "SELECT SessionID FROM tblSessions WHERE UserID = ?";
    db.all(strCommand, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})


// Delete session
app.delete('/sessions', (req, res, next) => {
    let arrParams = [req.query.sessionID, req.query.userID];
    console.log(arrParams)

    let strCommand = "DELETE FROM tblSessions WHERE SessionID = ? AND UserID = ?";
    if(arrParams[0] && arrParams[1]) {
        db.run(strCommand, arrParams, (err) => {
            if(err) {
                console.log(err.message)
                res.status(400).json({error: err.message});
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        res.status(400).json({error: 'Parameters not provided'});
    }
})


// Create new tree species
app.post('/tree', (req, res, next) => {
    let arrParams = [uuidv4(), req.query.scientificName, req.query.commonName, req.query.identifyURL];
    

    let strCommand = "INSERT INTO tblTree VALUES(?, ?, ?, ?)";
    if(arrParams[1] && arrParams[2] && arrParams[3]) {
        db.run(strCommand, arrParams, (err, result) => {
            if(err) {
                res.status(400).json({error: err.message});
            } else {
                res.status(200).json({message: 'Success', outcome: result});
            }
        })
    } else {
        res.status(400).json({error: 'Parameters not provided'});
    }
})



app.listen(HTTP_PORT);
console.log(`Listening on port ${HTTP_PORT}`);