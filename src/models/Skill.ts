import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  instructions: string;
  output: string;
  frequency: string;
  capability: string;
  subscription: string;
  team: string;
  tags: string[];
  uses: number;
  stars: number;
  tokens: string;
  createdAt: string;
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  instructions: { type: String, required: true },
  output: { type: String, default: '' },
  frequency: { type: String, default: 'weekly' },
  capability: { type: String, default: 'workflow' },
  subscription: { type: String, default: 'Free' },
  team: { type: String, default: 'My Workspace' },
  tags: { type: [String], default: [] },
  uses: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  tokens: { type: String, default: '0' },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

export const SkillModel = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
