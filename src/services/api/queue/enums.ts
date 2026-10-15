/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum QueueApiRoutes {
  GET = '/queue',
  ADD_TRACK = '/queue/tracks',
  REMOVE_TRACK = '/queue/tracks/:id',
  REORDER = '/queue/reorder',
  CLEAR = '/queue',
}