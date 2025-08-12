import type { Emitter } from 'mitt';

declare global {
  var __readEventBus__: Emitter<Events> | undefined;
}