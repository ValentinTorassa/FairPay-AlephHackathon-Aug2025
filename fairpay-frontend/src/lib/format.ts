export const shortAddr = (addr?: string) => addr ? `${addr.slice(0,6)}…${addr.slice(-4)}` : "";
