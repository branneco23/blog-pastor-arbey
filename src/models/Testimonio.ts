import mongoose, { Schema, model, models } from 'mongoose';

const TestimonioSchema = new Schema({
  title: { type: String, required: true },
  youtubeId: { type: String, required: true },
}, { timestamps: true });

const Testimonio = models.Testimonio || model('Testimonio', TestimonioSchema);
export default Testimonio;