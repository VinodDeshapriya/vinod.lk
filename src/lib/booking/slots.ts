import { bookingConfig as C, calendarConfigured } from "./config";
import { getBusy, type Busy } from "./google";

const MIN = 60_000;
const [sh, sm] = C.dayStart.split(":").map(Number);
const [eh, em] = C.dayEnd.split(":").map(Number);

/** Every bookable start time (UTC ms) between two dates, before calendar conflicts. */
function candidates(from: Date, to: Date): number[] {
  const out: number[] = [];
  const earliest = Date.now() + C.minNoticeHours * 60 * MIN;
  const latest = Date.now() + C.maxDaysAhead * 24 * 60 * MIN;
  // Walk Sri Lanka calendar days.
  const local = (t: number) => new Date(t + C.tzOffsetMin * MIN);
  const first = local(from.getTime());
  const day = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate()));
  for (let d = day.getTime(); d - C.tzOffsetMin * MIN < to.getTime(); d += 24 * 60 * MIN) {
    if (!C.days.includes(new Date(d).getUTCDay())) continue;
    const open = d + (sh * 60 + sm) * MIN - C.tzOffsetMin * MIN;
    const close = d + (eh * 60 + em) * MIN - C.tzOffsetMin * MIN;
    for (let t = open; t + C.durationMin * MIN <= close; t += C.slotStepMin * MIN) {
      if (t >= earliest && t <= latest && t >= from.getTime() && t < to.getTime()) out.push(t);
    }
  }
  return out;
}

const clashes = (t: number, busy: Busy[]) =>
  busy.some((b) => t < b.end + C.bufferMin * MIN && t + C.durationMin * MIN > b.start - C.bufferMin * MIN);

/** Free slots as ISO strings. Without a calendar connected, working hours only. */
export async function freeSlots(from: Date, to: Date): Promise<string[]> {
  const list = candidates(from, to);
  if (!list.length) return [];
  const busy = calendarConfigured() ? await getBusy(new Date(list[0] - 60 * MIN), new Date(list.at(-1)! + 2 * 60 * MIN)) : [];
  return list.filter((t) => !clashes(t, busy)).map((t) => new Date(t).toISOString());
}

/** True when this exact start time is still free. */
export async function isFree(start: Date) {
  const slots = await freeSlots(new Date(start.getTime() - MIN), new Date(start.getTime() + MIN));
  return slots.includes(start.toISOString());
}
