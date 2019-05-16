let router = require('express').Router();

let Post = require('./../models/post');

router.get('/', (req, res, next) => {
    Post.find().exec((err, posts) => {
        res.render('index', { posts: posts });
    });
});

router.post('/posts/:id/act', (req, res, next) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    Post.updateOne({_id: req.params.id}, {$inc: {likes_count: counter}}, {}, (err, numberAffected) => {
        let Pusher = require('pusher');

        let pusher = new Pusher({
            appId: "782170",
            key: "13c943dba30d6e63edb1",
            secret: "98e3c6aebd88da1bceba",
            cluster: 'eu'
        });
console.log( '???????????'+process.env.PUSHER_APP_ID);
        let payload = { action: action, postId: req.params.id };
        pusher.trigger('post-events', 'postAction', payload, req.body.socketId);
        res.send('');
    });
});


module.exports = router;
