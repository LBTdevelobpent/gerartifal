const mongoose = require("../../database");
const bcrypt = require('bcrypt');

//Criação do Schema do usuario
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },

    password: {
        type: String,
        require: true,
        select: false,
    },

    passwordResetToken: {
        type: String,
        select: false,
    },

    passwordResetExpires: {
        type: Date,
        select: false,
    },

    verified: {
        type: Boolean,
        default: false,
    },

    createAt: {
        type: Date,
        default: Date.now,
    }
});

//Codigo para encryptação da senha do Usuario
UserSchema.pre('save', async function(next) { 
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
//----------------------------------------//



//Exportação do Schema do Usuario
const User = mongoose.model('User', UserSchema);
module.exports = User;