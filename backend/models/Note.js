import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);