// import * as dotenv from 'dotenv'rs
// dotenv.config()

import express from 'express'
const app = express()



import cors from 'cors'
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
        res.send('Insider One Backend')
    })
    
    // import { authenticationMiddleware } from './middleware/auth.js'
    
import UserRouter from "./routes/user.routes.js"
app.use('/api/user', UserRouter);
    
import PostRouter from "./routes/post.routes.js"
app.use('/api/post', PostRouter);

    
import commentRouter from "./routes/comment.routes.js"
app.use('/api/comment', commentRouter);

    
import likeRouter from "./routes/like.routes.js"
app.use('/api/like', likeRouter);

    
    

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
