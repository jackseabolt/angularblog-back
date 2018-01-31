const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 
const jsonParser = bodyParser.json();
const { Post } = require('./models/post');  

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    next();
});

app.get('/posts', (req, res) => {
    Post.find({})
        .then(posts => {
            let postsArray = posts.map(post => post.apiRepr())
            return res.status(200).json( postsArray )
        })
}); 

app.post('/posts', jsonParser, (req, res) => {
    let { title } = req.body; 
    return Post.create({ title })
        .then(post => {
            return res.status(201).json(post.apiRepr());
        })
        .catch(err => {
            if(err) {
                return res.statusCode(500)
            }
        });
}); 

app.delete('/posts/:id', jsonParser, (req, res) => {
    let id = req.params.id
    console.log(id, "THESE ARE THE PARAMS RECIEVED")
    Post
        .find({ id })
        .then(post => {
            if(!post) {
                return res.status(422).json({ message: 'Post not found'})
            }
            return Post.findByIdAndRemove({ _id: id })
        })
        .then(() => {
            return res.status(204).json({ message: 'Post was deleted'})
        })
        .catch(err => {
            console.error(err)
        });
}); 

let server; 
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://admin:password@ds119688.mlab.com:19688/angularblog', err => {
            if(err) {
                return reject(err); 
            }
            server = app.listen(8080, () => {
                console.log("The application is listening on port 8080")
                resolve(); 
            })
            .on('error', err => {
                mongoose.disconnect(); 
                reject(err); 
            }); 
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server'); 
            server.close(err => {
                if(err) {
                    return reject(err);
                }
            resolve(); 
            });    
        }); 
    });
}

if(require.main === module) {
    runServer().catch(err => console.error(err))
}







