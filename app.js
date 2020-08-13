const express = require("express");
const app = express(); 
const morgan = require("morgan")
const postFuncs = require("./postBank")
const postList = require("./postList")
const timeAgo = require("node-time-ago")

const PORT = 1337;

app.use(express.static('public')) // static routing to public directory
app.use(morgan("dev")) //middleware

const posts = postFuncs.list()  // storing function list() exported from postBank module object in a const
const find = postFuncs.find()  // storing function find() exported from postBank module object in a const

app.get("/", (req, res) => {
  res.send(postList) 
});

app.get("/posts/:id", (req, res, next) => {
  const id = req.params.id
  const post = postFuncs.find(id)

  if(!post.id){
    next(new Error("this is an error"))
  }else{
    const html2 = `<!DOCTYPE HTML>
    <html>
      <head>
         <title> Wizard News </title>
         <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
         <div class="news-list">
           <header><img src="/logo.png"/> Wizard News </header>
          
               <div class="new-item">
                 <p>
                  ${post.title}
                   <small> (by ${post.name})</small>
                 </p>
                 ${post.content}
               </div>
             
         </div>
       </body>
     </html>`
  res.send(html2)
  }
  })

// creating error handler ; should always go before .listen

  app.use( function (err,req, res, next) {
    console.log(err.message)
    if(err.message){
      res.send("Page not found")
    }
  })


app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);

});
