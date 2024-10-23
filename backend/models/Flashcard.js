import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

export default mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);