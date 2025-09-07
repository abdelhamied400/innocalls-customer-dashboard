import { format } from "date-fns";

interface CallStats {
  incoming: number;
  outgoing: number;
  missed: number;
  rejected: number;
}

export type CallLogCall = {
  id: string;
  time: string;
  type: "incoming" | "outgoing" | "missed" | "rejected";
  number: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type CallLog = {
  number: string;
  name?: string;
  time: string;
  stats: CallStats;
  calls: CallLogCall[];
};

const getCallLog = (ext: string): CallLog[] => {
  try {
    const logString = localStorage.getItem(`callLog.${ext}`);
    if (!logString) return [];
    const log = JSON.parse(logString);

    return log || [];
  } catch {
    return [];
  }
};

export const getLatestCallLog = (ext: string): CallLog[] => {
  return [...getCallLog(ext)].reverse().map((log) => ({
    ...log,
    calls: [...log.calls].reverse(),
  }));
};

export const setCallLog = (callLog: CallLog[], ext: string): void => {
  localStorage.setItem(`callLog.${ext}`, JSON.stringify(callLog));
};
export const addCallToLog = (
  call: Omit<CallLogCall, "id" | "time">,
  ext: string
): void => {
  let callLog = getCallLog(ext);
  const callIndex = callLog.findIndex(({ number }) => number === call.number);
  const time = format(new Date(), "yyyy-MM-dd HH:mm a");
  const timestamp = new Date().getTime();
  const singleCall: CallLogCall = {
    id: `call-${timestamp}`,
    time: time,
    type: call.type,
    number: call.number,
    name: call.name,
    ...call,
  };

  if (callIndex !== -1) {
    // if the number exists
    const singleLog = callLog[callIndex];
    singleLog.time = time;
    singleLog.stats = {
      ...singleLog.stats,
      [singleCall.type]: singleLog.stats[singleCall.type] + 1,
    };
    singleLog.calls.push(singleCall);

    // remove the call from calls array and add it at the end
    callLog.splice(callIndex, 1);
    callLog = [...callLog, singleLog];
  } else {
    const singleLog: CallLog = {
      number: singleCall.number,
      name: singleCall.name,
      time: time,
      stats: {
        incoming: 0,
        outgoing: 0,
        missed: 0,
        rejected: 0,
        [singleCall.type]: 1,
      },
      calls: [singleCall],
    };
    callLog = [...callLog, singleLog];
  }

  setCallLog(callLog, ext);
};

export const clearCallLog = (ext: string): void => {
  localStorage.removeItem(`callLog.${ext}`);
};

export const deleteCallFromLog = (callId: string, ext: string): void => {
  const callLog = getCallLog(ext);
  const callIndex = callLog.findIndex(({ calls }) =>
    calls.some(({ id }) => id === callId)
  );

  if (callIndex !== -1) {
    const singleLog = callLog[callIndex];
    const callIndexInCalls = singleLog.calls.findIndex(
      ({ id }) => id === callId
    );

    if (callIndexInCalls !== -1) {
      const callToDelete = singleLog.calls[callIndexInCalls];
      singleLog.calls.splice(callIndexInCalls, 1);
      singleLog.stats[callToDelete.type] -= 1;

      if (singleLog.calls.length === 0) {
        callLog.splice(callIndex, 1);
      } else {
        callLog[callIndex] = singleLog;
      }

      setCallLog(callLog, ext);
    }
  }
};

export const updateCallInLog = (call: CallLogCall, ext: string): void => {
  const callLog = getCallLog(ext);
  const callIndex = callLog.findIndex(({ calls }) =>
    calls.some(({ id }) => id === call.id)
  );

  if (callIndex !== -1) {
    const singleLog = callLog[callIndex];
    const callIndexInCalls = singleLog.calls.findIndex(
      ({ id }) => id === call.id
    );

    if (callIndexInCalls !== -1) {
      singleLog.calls[callIndexInCalls] = call;
      callLog[callIndex] = singleLog;

      // calculate the stats again
      singleLog.stats = singleLog.calls.reduce(
        (acc, { type }) => {
          acc[type] = acc[type] + 1;
          return acc;
        },
        { incoming: 0, outgoing: 0, missed: 0, rejected: 0 }
      );

      setCallLog(callLog, ext);
    }
  }
};
