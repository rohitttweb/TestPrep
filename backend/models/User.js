import bcrypt from 'bcryptjs'; 
import mongoose from 'mongoose'
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true,
    },
    email: {
      type: String,
      minlength: [3, 'eamil must be at least 3 characters long'],
      trim: true,
    },
    bio: {
      type: String,
      minlength: [3, 'bio must be at least 3 characters long'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minlength: [5, 'Username must be at least 5 characters long'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'org'], 
      default: 'user',
    },
  },
  {
    timestamps: true, 
  }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next(); 
  } catch (err) {
    next(err); 
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // Compare the provided password with the stored hash
};

const User = mongoose.model('User', userSchema);
export default User;
