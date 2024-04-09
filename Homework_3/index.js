const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const dbSource = 'todo.db';
const db = new sqlite3.Database(dbSource);
db.run('PRAGMA foreign_keys = ON;');

const HTTP_PORT = 8000;

var app = express();
app.use(cors());


//get all tasks
app.get('/', (req, res, next) => {
    let strCommand = "select * from tblTasks";
    db.all(strCommand, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            console.log(err.message);
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})


// Get certain task
app.get('/task', (req, res, next) => {
    let arrParams = [req.query.taskID];
    let strCommand = "SELECT * FROM tblTasks WHERE taskID = ?";
    db.all(strCommand, arrParams, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            console.log(err.message);
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})



//get all groups
app.get('/group', (req, res, next) => {
    let strCommand = "select * from tblGroups";
    db.all(strCommand, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            console.log(err.message);
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})



//get certain group
app.get('/group', (req, res, next) => {
    let arrParams = [req.query.groupID];
    let strCommand = "SELECT * FROM tblGroups WHERE GroupID = ?";
    db.all(strCommand, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            console.log(err.message);
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})


//get all tasks of a certain month
app.get('/schedule', (req, res, next) => {
    let strYear = req.query.year;
    let strMonth = req.query.month;
    if(strMonth.length == 1) {
        strMonth = `0${strMonth}`;
    }
    let arrParams = [`${strYear}-${strMonth}%`]

    let strCommand = "select * from tblTasks where DueDate like ? ORDER BY DueDate";
    db.all(strCommand, arrParams, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
            console.log(err.message);
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})


//Create new task
app.post('/task', (req, res, next) => {
    let arrParams = [req.query.name, req.query.date, req.query.location, req.query.instructions, req.query.group, req.query.taskID];
    
    let strCommand = "insert into tblTasks values(?, ?, ?, ?, ?, 0, ?)";
    if(arrParams[0] && arrParams[4]) {
        db.run(strCommand, arrParams, (err, result) => {
            if(err) {
                res.status(400).json({error: err.message});
                console.log(err.message);
            } else {
                res.status(200).json({message: 'Success', outcome: result});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide task name and group'});
    }
})


//create new group
app.post('/group', (req, res, next) => {
    let arrParams = [req.query.group, req.query.color];

    let strCommand = "INSERT INTO tblGroups (GroupName, GroupColor) VALUES(?, ?)";
    if(arrParams[0] && arrParams[1]) {
        db.run(strCommand, arrParams, (err, result) => {
            if(err) {
                res.status(400).json({error: err.message});
                console.log(err.message);
            } else {
                res.status(200).json({message: 'Success', outcome: result});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide group name and color'});
    }
})


//delete certain group
app.delete('/group', (req, res, next) => {
    let arrParams = [req.query.groupID];

    let strCommand = "DELETE FROM tblGroups WHERE GroupID = ?";
    if(arrParams[0]) {
        db.run(strCommand, arrParams, (err) => {
            if(err) {
                console.log(err.message)
                res.status(400).json({error: err.message});
                console.log(err.message);
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        console.log("params")
        res.status(400).json({error: 'Must provide a groupID'});
    }
})


//delete certain task
app.delete('/task', (req, res, next) => {
    let arrParams = [req.query.taskID];

    let strCommand = "DELETE FROM tblTasks WHERE TaskID = ?";
    if(arrParams[0]) {
        db.run(strCommand, arrParams, (err) => {
            if(err) {
                res.status(400).json({error: err.message});
                console.log(err.message);
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide a taskid'});
    }
})



//update status
app.put('/status', (req, res, next) => {
    let arrParams = [req.query.status, req.query.taskID];
    console.log(arrParams)

    let strCommand = "UPDATE tblTasks SET Status = ? WHERE TaskID = ?";
    if(arrParams[0] && arrParams[1]) {
        db.run(strCommand, arrParams, (err) => {
            if(err) {
                res.status(400).json({error: err.message});
                console.log(err.message);
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide a taskid'});
    }
})





app.listen(HTTP_PORT);
console.log(`Listening on port ${HTTP_PORT}`);