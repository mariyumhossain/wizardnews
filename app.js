const express = require("express");
const app = express(); 
const morgan = require("morgan")
const postFuncs = require("./postBank")
const timeAgo = require("node-time-ago")
const PORT = 1337;

app.use(express.static('public'))

const posts = postFuncs.list()
const find = postFuncs.find()

const html = `<!DOCTYPE HTML>
 <html>
   <head>
      <title> Wizard News </title>
      <link rel="stylesheet" href="/style.css" />
   </head>
   <body>
      <div class="news-list">
        <header><img src="/logo.png"/> Wizard News </header>
        ${posts.map(post => `
            <div class="new-item">
              <p>
                <span class="news-position">${post.id}.
              </span><a href="/posts/${post.id}">${post.title}</a>
                <small> (by ${post.name})</small>
              </p>
              <small class="news-info">
                ${post.upvotes} upvotes | ${timeAgo(post.date)}
              </small>
            </div>`
            ).join('')}
      </div>
    </body>
  </html>`


app.get("/", (req, res) => {
  res.send(html) 
  
});

app.get("/posts/:id", (req, res, next) => {
  const id = req.params.id
  const post = postFuncs.find(id)

  if(!post.id){
    next(new Error("page not found"))
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


  app.use( function (err,req, res, next) {
    // console.log(err.message)
    if(err.message){
      res.send("Page not found")
    }
  })




app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);

});
