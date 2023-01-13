const express = require("express");
const blogRoutes = require("./routers/blogRoutes");

const port = 8000;
const app = express();
app.use(express.json());
app.use(express.static("./uploads"))

app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`)
})

app.use('/uploaded', express.static(process.cwd() + '/uploads'))
app.get("/", (req,res)=>{
    res.send("Welcome to API text")
});
app.use("/api", blogRoutes)