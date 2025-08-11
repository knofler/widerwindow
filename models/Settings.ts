import { Schema, models, model, InferSchemaType } from 'mongoose';

const SettingsSchema = new Schema({
  siteTitle: { type: String, default: 'WiderWindow' },
  siteDescription: { type: String, default: 'Insights & tutorials.' },
  heroImage: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

SettingsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export type Settings = InferSchemaType<typeof SettingsSchema>;
export default models.Settings || model('Settings', SettingsSchema);
