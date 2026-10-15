import { useRequest } from '@/composables/useRequest'
import {
  DraftSchema,
  CoUploaderSchema,
  UploadSlotStatusSchema,
  type Draft,
  type CoUploader,
  type UploadSlotStatus,
} from './types'

export const useUploadsApi = () => {
  const createDraft = async (filename: string, clubId?: number) => {
    return useRequest<Draft>(
      '/uploads/drafts',
      { method: 'POST', data: { filename, clubId } },
      { schema: DraftSchema, silent: false },
    )
  }

  const uploadDraftFile = async (draftId: string, file: File) => {
    const form = new FormData()
    form.append('audio', file)
    return useRequest<any>(
      `/uploads/drafts/${draftId}/file`,
      { method: 'POST', data: form },
      { silent: false },
    )
  }

  const getMyDrafts = async (limit = 20, offset = 0) => {
    return useRequest<Draft>(
      `/uploads/drafts/mine?limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      { schema: DraftSchema, silent: true },
    )
  }

  const getDraft = async (draftId: string) => {
    return useRequest<Draft>(
      `/uploads/drafts/${draftId}`,
      { method: 'GET' },
      { schema: DraftSchema },
    )
  }

  const getUploadSlots = async () => {
    return useRequest<UploadSlotStatus>(
      '/uploads/slots',
      { method: 'GET' },
      { schema: UploadSlotStatusSchema },
    )
  }

  const getCoUploaders = async (trackId: number) => {
    return useRequest<CoUploader>(
      `/tracks/${trackId}/co-uploaders`,
      { method: 'GET' },
      { schema: CoUploaderSchema, silent: true },
    )
  }

  const addCoUploader = async (
    trackId: number,
    data: { userId: string; role: string; xpSharePercent: number; contributionType?: string },
  ) => {
    return useRequest<CoUploader>(
      `/uploads/co-uploaders/${trackId}`,
      { method: 'POST', data },
      { schema: CoUploaderSchema, silent: false },
    )
  }

  const removeCoUploader = async (trackId: number, userId: string) => {
    return useRequest<void>(
      `/uploads/co-uploaders/${trackId}/${userId}`,
      { method: 'DELETE' },
      { silent: false },
    )
  }

  const listPendingDrafts = async (source?: string, limit = 20, offset = 0) => {
    const qs = source ? `?source=${source}` : ''
    return useRequest<Draft>(
      `/uploads/review${qs}&limit=${limit}&offset=${offset}`,
      { method: 'GET' },
      { schema: DraftSchema, silent: true },
    )
  }

  const reviewDraft = async (draftId: string, action: 'accept' | 'reject', notes?: string) => {
    return useRequest<any>(
      `/uploads/review/${draftId}`,
      { method: 'POST', data: { action, notes } },
      { silent: false },
    )
  }

  return {
    createDraft,
    uploadDraftFile,
    getMyDrafts,
    getDraft,
    getUploadSlots,
    getCoUploaders,
    addCoUploader,
    removeCoUploader,
    listPendingDrafts,
    reviewDraft,
  }
}
