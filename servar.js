const express = require("express");
const app = express();
const sqlite = require("sqlite3");
app.use(express.json());
const port = 3000

var db_tables = new sqlite.Database("saral.db",(err)=>{
    if (err){
        console.log(err);
    }else{
    	 // this code create a Courses table..

        db_tables.run("create table if not exists courses (courseId integer Primary key autoincrement, exercise_id integer, name TEXT, description TEXT)");
        
        // this code create a exercise table..

        db_tables.run("create table if not exists exercise (exercise_id integer Primary key autoincrement,submissions_id integer, courseId integer, name TEXT, content TEXT, hint TEXT)");

        // this line create a submissions table ...

        db_tables.run("create table if not exists submissions (submissions_id integer Primary key autoincrement, courseId integer, exercise_id integer, content TEXT, userName TEXT)");

        console.log("database tables make successfully"); 
    }
})

// this lien is you post course name/title and description ...

app.post("/postcourse",(req, res)=>{
    let {name,description} = req.body;
    
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err) {
            db_tables.run('insert into courses (name,description,exercise_id) values(" '+name+' "," '+description+' "," '+1+' ")');
            db_tables.all("select * from courses",(err, data)=>{
                if (!err){
                    db_tables.close();
                    console.log('data is insert successfully')
                    course_Id=data[data.length-1].courseId
                    return res.send({"name":name,"description":description,"course_Id":course_Id})
                }else{
                    console.log(err)
                    res.send("Error",err)
                }
            })
        }else{
            console.log(err.message)
            res.send(err.message)
        }
    })
})

// this lien show all courses list...

app.get("/courses",(req, res)=>{
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all("select courseId,name,description from courses",(err, data)=>{
                if (!err){
                    res.send(data)
                    db_tables.close();
                }else{
                    console.log(err)
                    res.send("Error",err)
                }
            })
        }else{
            res.send("Error",message)
            console.log("Error",message)
        }
    })
})

// this lien show you only 1 course in Id...

app.get("/courses/:id",(req,res)=>{
    let courses_id = req.params.id;
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select courseId,name,description from courses where courseId="'+courses_id+'";',(err, data)=>{
                if (!err){
                    res.send(data)
                }else{
                    console.log(err)
                    res.send("Error",err)
                }
            })
        }else{
            console.log(err)
            res.send("Error",err)
        }
    })
})

// this lien update the course in Id...

app.put("/putcourses/:id",(req, res)=>{
    let {name,description} = req.body;
    let update_id = req.params.id;
    // console.log(name, description,update_id)

    let db_tables = new sqlite.Database('saral.db', (err)=>{
        if (err){
            console.log(err);
        }else{
            db_tables.run('update courses set name ="'+name+'",description="'+description+'" where courseId ="'+update_id+'"');
            db_tables.close();
            return res.send('Successful');
        }
    })

})

// this lien post exercise data use to courses Id...

app.post("/courses/:id/exercise",(req, res)=>{
    let courses_id = req.params.id;
    let {name,content,hint} = req.body;
    
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.run('insert into exercise (courseId, name, content, hint, submissions_id) values("'+courses_id+'", "'+name+'", "'+content+'", "'+hint+'", "'+1+'")')
            db_tables.all("select * from exercise",(err,data)=>{
                if (!err){
                    db_tables.close();
                    console.log('insert exercise data successfully')
                    exercise_id = data[data.length-1].exercise_id
                    res.send({"exercise_id":exercise_id,"courses_id":courses_id, "name":name, "content":content, "hint":hint})
                }else{
                    console.log(err)
                    res.send("Error",err)
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

// this code work is the show a partical one course exercises..

app.get("/courses/:id/exercise",(req,res)=>{
    let courses_id = req.params.id;
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select * from exercise where courseId= "'+courses_id+'"',(err,data)=>{
                if (data){
                    db_tables.close();
                    res.send(data)
                }else{
                    console.log(err)
                    res.send(err)
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

// this code is show a course one exercis...

app.get("/courses/:id/exercise/:exercise_name",(req,res)=>{
    let courses_id = req.params.id;
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select * from exercise where courseId= "'+courses_id+'"',(err,data)=>{
                if (data){
                    db_tables.close();
                    data.forEach((elements)=>{
                        if (elements.name == req.params.exercise_name){
                            res.send(elements)
                        }
                    })
                }else{
                    console.log(err)
                    res.send(err)
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

// this lien update the exercise in to use Id...

app.put("/courses/:id/exercise/:E_id",(req,res)=>{
    let courses_id = req.params.id;
    let update_id = req.params.E_id;
    let {name,content,hint}=req.body;
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select * from courses where courseId= "'+courses_id+'"',(err,data)=>{
                if (data.length != 0){
                    db_tables.all('select * from exercise where courseId= "'+courses_id+'" AND exercise_id="'+update_id+'"',(error,e_data)=>{
                        if (e_data.length != 0){
                            console.log(e_data)
                            db_tables.run('update exercise set name ="'+name+'",content="'+content+'",hint="'+hint+'" where exercise_id ="'+update_id+'"');
                            db_tables.close();
                            return res.send('Successful');
                        }else{
                            console.log("sorry sir this exercise not available ...")
                            res.send("sorry sir this exercise not available ...")
                        }
                    })
                    
                }else{
                    console.log("sorry sir this course not available ...")
                    res.send("sorry sir this course not available ...")
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

// this code is post submissions..

app.post("/couress/:id/exercise/:Id/NewSubmissions",(req, res)=>{
    let courses_id = req.params.id;
    let exercise_id = req.params.Id;
    let {userName,content}=req.body;
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select * from courses where courseId= "'+courses_id+'"',(err,data)=>{
                if (data.length != 0){
                    db_tables.all('select * from exercise where courseId= "'+courses_id+'" AND exercise_id="'+exercise_id+'"',(error,e_data)=>{
                        if (e_data.length != 0){
                            console.log(e_data)
                            db_tables.run('insert into submissions (courseId, exercise_id, userName, content) values("'+courses_id+'", "'+exercise_id+'", "'+userName+'", "'+content+'")')
                            db_tables.close();
                            return res.send('Successful');
                        }else{
                            console.log("sorry sir this exercise not available ...")
                            res.send("sorry sir this exercise not available ...")
                        }
                    })
                    
                }else{
                    console.log("sorry sir this course not available ...")
                    res.send("sorry sir this course not available ...")
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })

})

// this code is show you all partical exercise...

app.get("/couress/:id/exercise/:Id/submissions",(req,res)=>{
    let courses_id = req.params.id;
    let exercise_id = req.params.Id;
    console.log(courses_id,exercise_id)
    let db_tables = new sqlite.Database("saral.db",(err)=>{
        if (!err){
            db_tables.all('select * from courses where courseId= "'+courses_id+'"',(err,data)=>{
                if (data.length != 0){
                    db_tables.all('select * from exercise where courseId= "'+courses_id+'" AND exercise_id="'+exercise_id+'"',(error,e_data)=>{
                        if (e_data.length != 0){
                            db_tables.all('select * from submissions where courseId= "'+courses_id+'" AND exercise_id="'+exercise_id+'"',(err,data)=>{
                                if (data){
                                    db_tables.close();
                                    res.send(data)
                                }else{
                                    console.log(err)
                                    res.send(err)
                                }
                            })
                        }else{
                            console.log("sorry sir this exercise not available ...")
                            res.send("sorry sir this exercise not available ...")
                        }
                    })
                    
                }else{
                    console.log("sorry sir this course not available ...")
                    res.send("sorry sir this course not available ...")
                }
            })
        }else{
            console.log(err)
            res.send(err)
        }
    })
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}!`)
})