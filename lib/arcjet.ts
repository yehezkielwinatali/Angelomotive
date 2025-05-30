import arcjet, { detectBot, tokenBucket } from "@arcjet/next";

// Create an Arcjet instance with multiple rules
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"],
  rules: [
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 10, // refill 10 tokens per interval
      interval: 3600, // refill every 1 hour
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
  ],
});

export default aj;
