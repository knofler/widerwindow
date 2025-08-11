import { Schema, models, model, InferSchemaType } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String },
  // original markdown (derived from editorState)
  contentMarkdown: { type: String },
  // HTML (optional) if we later serialize; leave nullable for now
  contentHtml: { type: String },
  // TipTap JSON state
  editorState: { type: Schema.Types.Mixed },
  tags: [{ type: String, index: true }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  affiliateLinks: [{ label: String, url: String, clicks: { type: Number, default: 0 } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

PostSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export type Post = InferSchemaType<typeof PostSchema>;
export default models.Post || model('Post', PostSchema);
