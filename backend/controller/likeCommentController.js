const likeCommentDao = require('../dao/likeCommentDao');

exports.likeBlog = (req, res) => {
  const blogId = req.params.id;
  const email = req.user.email;

  likeCommentDao.getUserReaction(blogId, email, (err, currentReaction) => {
    if (err) return res.status(500).json({ message: 'Error checking reaction.' });
    if (currentReaction === 'like') {
      return res.status(409).json({ message: 'You already liked this blog.' }); 
    }
    likeCommentDao.upsertReaction(blogId, email, 'like', (err) => {
      if (err) return res.status(500).json({ message: 'Error liking blog.' });
      res.status(200).json({ message: currentReaction === 'dislike' ? 'Changed to like.' : 'Blog liked.' });
    });
  });
};

exports.dislikeBlog = (req, res) => {
  const blogId = req.params.id;
  const email = req.user.email;

  likeCommentDao.getUserReaction(blogId, email, (err, currentReaction) => {
    if (err) return res.status(500).json({ message: 'Error checking reaction.' });
    if (currentReaction === 'dislike') {
      return res.status(409).json({ message: 'You already liked this blog.' }); 
    }
    likeCommentDao.upsertReaction(blogId, email, 'dislike', (err) => {
      if (err) return res.status(500).json({ message: 'Error disliking blog.' });
      res.status(200).json({ message: currentReaction === 'like' ? 'Changed to dislike.' : 'Blog disliked.' });
    });
  });
};

exports.getLikeDislikeCounts = (req, res) => {
  const blogId = req.params.id;

  likeCommentDao.getReactionCounts(blogId, (err, counts) => {
    if (err) return res.status(500).json({ message: 'Failed to count reactions' });
    res.status(200).json(counts);
  });
};

exports.commentOnBlog = (req, res) => {
  const blogId = req.params.id;
  const email = req.user.email;
  const text = req.body.text;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty.' });
  }

  likeCommentDao.addComment(blogId, email, text, (err) => {
    if (err) return res.status(500).json({ message: 'Error posting comment.' });
    res.status(200).json({ message: 'Comment posted.' });
  });
};

exports.getComments = (req, res) => {
  const blogId = req.params.id;

  likeCommentDao.getComments(blogId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error loading comments.' });
    res.status(200).json(results);
  });
};
exports.getUserReaction = (req, res) => {
  const blogId = req.params.id;
  const email = req.user.email;

  likeCommentDao.getUserReaction(blogId, email, (err, reaction) => {
    if (err) return res.status(500).json({ message: 'Error retrieving reaction.' });
    res.status(200).json({ reaction }); 
  });
};
