import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  complaint_id?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  language: string;
  extracted_data: {
    crime_type?: string;
    amount?: number;
    date?: Date;
    location?: string;
    description?: string;
  };
  created_at: Date;
  updated_at: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    complaint_id: { type: String, index: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    language: { type: String, default: 'hi' }, // hi, santhali, nagpuri
    extracted_data: {
      crime_type: String,
      amount: Number,
      date: Date,
      location: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

