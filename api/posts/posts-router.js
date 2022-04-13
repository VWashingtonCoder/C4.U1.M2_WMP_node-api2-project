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
    let id = req.params.id;
    
    Post.findById(id)
        .then(post => {
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'The post information could not be retrieved' })
        })
})
// Create New Post
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents){
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
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
            .then(updated => {
                if(!updated){
                    res.status(404).json({ message: 'The post with the specified ID does not exist' })
                    
                } else {
                   return Post.findById(id) 
                }
            })
            .then(post =>{
                console.log(post)
                res.status(200).json(post)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'The post information could not be modified' })
            })
    }
})
// Delete Specified Post
router.delete('/:id', async (req, res) => {
    try{
        let id = req.params.id
        const post = await Post.findById(id)
        console.log(post)
        
        if(!post){
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            await Post.remove(id)
            res.status(200).json(post)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'The post could not be removed' })
    }
})
// GET All Comments On Specified Post
router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then(comments => {
            if(comments.length > 0){
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'The comments information could not be retrieved' })
        })
})

module.exports = router;