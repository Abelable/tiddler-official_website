import { fetchEventSource } from "@microsoft/fetch-event-source";

export const sendMsgToChatGPT = async (msg, signal, onmessage, onerror) =>
  await fetchEventSource("https://gpt.talking.vip/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ msg }),
    signal,
    onmessage,
    onerror,
  });
