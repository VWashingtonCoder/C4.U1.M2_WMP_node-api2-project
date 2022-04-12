// implement your posts router here
const express = require('express');
const { reset } = require('nodemon');
const Post = require('./posts-model');

const router = express.Router();
// GET All Posts
router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'The posts information could not be retrieved' })
        })
})
// GET Specified Post
router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    if(Number.isNaN(id)){
        res.status(404).json({ message: 'The post with the specified ID deos not exist' })
        return
    } 
    Post.findById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post with the specified ID deos not exist' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'The post information could not be retrieved' })
        })
})
// Create New Post
router.post('/', (req, res) => {
    let postBody = req.body
    if(!postBody.title || !postBody.contents){
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
        Post.insert(req.body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'There was an error while saving the post to the database' })
            })
    }
})
// Updates Specified Post
router.put('/:id', (req, res) => {
    const changes = req.body;
    const id = req.params.id;

    if (!changes.title || !changes.contents){
        res.status(400).json({ message: 'Please provide title and contents for the post' })       
    } else {
        Post.update(id, changes)
            .then(post => {
                if(post){
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: 'The post with the specified ID does not exist' })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'The post information could not be modified' })
            })
    }
})

module.exports = router;