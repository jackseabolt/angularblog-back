const mongoose = require('mongoose'); 

const PostSchema = mongoose.Schema({
    title: { type: String, required: true}, 
    checked: { type: Boolean, required: true}
}); 

PostSchema.methods.apiRepr = function(){
    return { 
        id: this._id, 
        title: this.title, 
        checked: this.checked
    }
}

const Post = mongoose.modelNames.Post || mongoose.model('Post', PostSchema); 

module.exports = { Post }