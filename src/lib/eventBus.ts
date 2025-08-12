// /lib/eventBus.ts
import mitt, { Emitter } from 'mitt';

type Events = {
  // payload은 선택적으로 사용 가능
  reloadReadData: { selectedDate?: string; childId?: string } | undefined;
};

const emitter: Emitter<Events> =
  globalThis.__readEventBus__ ?? (globalThis.__readEventBus__ = mitt<Events>());

export default emitter;
