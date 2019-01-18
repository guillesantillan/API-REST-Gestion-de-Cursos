const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: 'Campo obligatorio' },
    password: { type: String, required: 'Campo obligatorio' }
});

module.exports = mongoose.model('User', userSchema);