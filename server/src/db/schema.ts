import { pgTable, serial, varchar, text, timestamp, integer, boolean, decimal, index } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('candidate'), // 'admin', 'hr', 'candidate'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 职位表
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  location: varchar('location', { length: 255 }),
  salaryMin: decimal('salary_min', { precision: 10, scale: 2 }),
  salaryMax: decimal('salary_max', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).notNull().default('open'), // 'open', 'closed', 'draft'
  hrId: integer('hr_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  hrIdIdx: index('idx_jobs_hr_id').on(table.hrId),
  statusIdx: index('idx_jobs_status').on(table.status),
}));

// 简历表
export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  parsedData: text('parsed_data'), // JSON 字符串存储解析后的数据
  score: decimal('score', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'analyzed', 'reviewed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  candidateIdIdx: index('idx_resumes_candidate_id').on(table.candidateId),
  statusIdx: index('idx_resumes_status').on(table.status),
}));

// 申请表（职位申请记录）
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => jobs.id).notNull(),
  resumeId: integer('resume_id').references(() => resumes.id).notNull(),
  candidateId: integer('candidate_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('applied'), // 'applied', 'screening', 'interview', 'rejected', 'hired'
  coverLetter: text('cover_letter'),
  hrNotes: text('hr_notes'),
  aiScore: decimal('ai_score', { precision: 5, scale: 2 }),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jobIdIdx: index('idx_applications_job_id').on(table.jobId),
  candidateIdIdx: index('idx_applications_candidate_id').on(table.candidateId),
  statusIdx: index('idx_applications_status').on(table.status),
}));

// 技能表
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 简历-技能关联表
export const resumeSkills = pgTable('resume_skills', {
  id: serial('id').primaryKey(),
  resumeId: integer('resume_id').references(() => resumes.id, { onDelete: 'cascade' }).notNull(),
  skillId: integer('skill_id').references(() => skills.id, { onDelete: 'cascade' }).notNull(),
  level: integer('level'), // 1-5 技能熟练度
}, (table) => ({
  resumeIdIdx: index('idx_resume_skills_resume_id').on(table.resumeId),
  skillIdIdx: index('idx_resume_skills_skill_id').on(table.skillId),
}));

// 导出类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type ResumeSkill = typeof resumeSkills.$inferSelect;
export type NewResumeSkill = typeof resumeSkills.$inferInsert;
