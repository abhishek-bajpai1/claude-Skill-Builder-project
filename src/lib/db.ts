// Graceful Fallback Data Store (MongoDB + FS)
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongoose';
import { SkillModel } from '@/models/Skill';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export interface Skill {
  id?: string;
  _id?: string;
  name: string;
  instructions: string;
  output: string;
  frequency: string;
  capability: 'workflow' | 'skill' | 'agent';
  subscription: 'Free' | 'Pro' | 'Max';
  team?: string;
  tags?: string[];
  uses: number;
  stars: number;
  tokens: string;
  createdAt: string;
}

export interface WorkspaceState {
  riceBacklog: any[];
  classifiedInbox: any[];
  lastUpdate: string;
}

export interface UserProfile {
  role: string;
  level: string;
  completedSteps: number[];
  onboardingSeen: boolean;
  lastVisit: string;
}

export interface ActivityEvent {
  id: string;
  type: 'skill_created' | 'skill_deleted' | 'rice_run' | 'level_up' | 'role_switch';
  description: string;
  timestamp: string;
  meta?: any;
}

const DEFAULT_PROFILE: UserProfile = {
  role: 'Professional',
  level: 'Beginner',
  completedSteps: [],
  onboardingSeen: false,
  lastVisit: new Date().toISOString(),
};

const DEFAULT_WORKSPACE: WorkspaceState = {
  riceBacklog: [],
  classifiedInbox: [],
  lastUpdate: new Date().toISOString(),
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, `${filename}.json`);
}

// FS Generic Read/Write
function readDataSync<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

function writeDataSync<T>(filename: string, data: T) {
  ensureDataDir();
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


// Asynchronous Domain-specific helpers with Graceful Fallback
export async function readSkills(): Promise<Skill[]> {
  const db = await connectToDatabase();
  if (db) {
    const docs = await SkillModel.find().lean();
    return docs.map((d: any) => ({ ...d, id: d._id.toString() } as unknown as Skill));
  }
  return readDataSync<Skill[]>('skills', []);
}

export async function writeSkills(skills: Skill[]): Promise<void> {
  const db = await connectToDatabase();
  if (db) {
    // Basic sync logic (could be improved in prod)
    await SkillModel.deleteMany({});
    await SkillModel.insertMany(skills);
    return;
  }
  writeDataSync('skills', skills);
}

export async function readWorkspace(): Promise<WorkspaceState> {
  // Can move to mongo model later
  return readDataSync<WorkspaceState>('workspace', DEFAULT_WORKSPACE);
}

export async function writeWorkspace(ws: WorkspaceState): Promise<void> {
  writeDataSync('workspace', ws);
}

export async function readProfile(): Promise<UserProfile> {
  return readDataSync<UserProfile>('profile', DEFAULT_PROFILE);
}

export async function writeProfile(profile: UserProfile): Promise<void> {
  writeDataSync('profile', profile);
}

export async function readActivity(): Promise<ActivityEvent[]> {
  return readDataSync<ActivityEvent[]>('activity', []);
}

export async function writeActivity(activity: ActivityEvent[]): Promise<void> {
  writeDataSync('activity', activity);
}

export async function logActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
  const activity = await readActivity();
  const newEvent: ActivityEvent = {
    ...event,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  activity.unshift(newEvent);
  await writeActivity(activity.slice(0, 50));
  return newEvent;
}
