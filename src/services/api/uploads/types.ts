import { z } from 'zod'

export const DraftSchema = z.object({
  id: z.string(),
  uploadedBy: z.string(),
  originalFilename: z.string(),
  fileSize: z.number(),
  format: z.string(),
  durationSeconds: z.number().optional(),
  bitrate: z.number().optional(),
  status: z.string(),
  uploadSource: z.string(),
  clubId: z.number().optional(),
  needsReview: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Draft = z.infer<typeof DraftSchema>

export const CoUploaderSchema = z.object({
  id: z.number(),
  trackId: z.number(),
  userId: z.string(),
  role: z.string(),
  xpSharePercent: z.number(),
  contributionType: z.string().optional(),
  addedAt: z.string(),
})

export type CoUploader = z.infer<typeof CoUploaderSchema>

export const UploadSlotStatusSchema = z.object({
  available: z.boolean(),
  used: z.number(),
  max: z.number(),
})

export type UploadSlotStatus = z.infer<typeof UploadSlotStatusSchema>
