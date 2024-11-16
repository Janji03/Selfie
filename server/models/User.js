import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


// Creazione del modello utente
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: { 
    type: String, 
    default: 'uploads/default.jpg' 
  },
  bio: {
    type: String,
    default: '', 
  },
  birthday: {
    type: Date, 
    default: null,
  },
  pronouns: {
    type: String,
    enum: ['he/him', 'she/her', 'they/them', 'other', 'prefer not to say'],
    default: 'prefer not to say', 
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    default: 'prefer not to say', 
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
 
}, { timestamps: true });

// Pre-save hook per criptare la password prima di salvarla nel database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodo per confrontare la password durante il login
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
