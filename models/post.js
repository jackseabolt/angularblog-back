const mongoose = require('mongoose'); 

const PostSchema = mongoose.Schema({
    title: { type: String, required: true}
}); 

PostSchema.methods.apiRepr = function(){
    return { 
        id: this._id, 
        title: this.title
    }
}

const Post = mongoose.modelNames.Post || mongoose.model('Post', PostSchema); 

module.exports = { Post }