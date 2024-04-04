const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const dbSource = 'todo.db';
const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8000;

var app = express();
app.use(cors());


//get all tasks
app.get('/', (req, res, next) => {
    let strCommand = "select * from tblTasks";
    db.all(strCommand, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
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
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})

//get all tasks of certain group
app.get('/group', (req, res, next) => {
    let arrParams = [req.query.group];
    let strCommand = "select * from tblTasks where Group = ?";
    db.all(strCommand, arrParams, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
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

    let strCommand = "select * from tblTasks where DueDate like ?";
    db.all(strCommand, arrParams, (err, row) => {
        if(err) {
            res.status(400).json({error: err.message});
        } else {
            res.status(200).json({message: 'Success', outcome: row});
        }
    })
})


//Create new task
app.post('/task', (req, res, next) => {
    let arrParams = [req.query.name, req.query.date, req.query.location, req.query.instructions, req.query.group];
    

    let strCommand = "insert into tblTasks values(?, ?, ?, ?, ?)";
    if(arrParams[0] && arrParams[4]) {
        db.run(strCommand, arrParams, (err, result) => {
            if(err) {
                res.status(400).json({error: err.message});
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

    console.log(arrParams);
    

    let strCommand = "INSERT INTO tblGroups (GroupName, GroupColor) VALUES(?, ?)";
    if(arrParams[0] && arrParams[1]) {
        db.run(strCommand, arrParams, (err, result) => {
            if(err) {
                res.status(400).json({error: err.message});
            } else {
                res.status(200).json({message: 'Success', outcome: result});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide group name and color'});
    }
})



//delete certain task
app.delete('/task', (req, res, next) => {
    let arrParams = [req.query.taskid];

    let strCommand = "delete from tblTasks where TaskID = ?";
    if(arrParams[1]) {
        db.all(strCommand, arrParams, (err, row) => {
            if(err) {
                res.status(400).json({error: err.message});
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide a taskid'});
    }
})



//delete all tasks in database
app.delete('/delete', (req, res, next) => {
    let strRecieved = req.query.rows;

    if(strRecieved == "all") {
        db.all("delete from tblTasks", (err, row) => {
            if(err) {
                res.status(400).json({error: err.message});
            } else {
                res.status(200).json({message: 'Success', outcome: `${this.changes} row(s) affected`});
            }
        })
    } else {
        res.status(400).json({error: 'Must provide rows=all'});

    }
})





app.listen(HTTP_PORT);
console.log(`Listening on port ${HTTP_PORT}`);