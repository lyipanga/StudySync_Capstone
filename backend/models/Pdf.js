import mongoose from 'mongoose';

const PdfSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
});

export default mongoose.models.Pdf || mongoose.model('Pdf', PdfSchema);