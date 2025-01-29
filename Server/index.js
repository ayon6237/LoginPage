const app = require('./App');
const port = 5000;
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
})