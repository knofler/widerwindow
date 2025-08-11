import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'author'], default: 'author' },
  createdAt: { type: Date, default: Date.now }
});

export type User = InferSchemaType<typeof UserSchema>;
export default models.User || model('User', UserSchema);
