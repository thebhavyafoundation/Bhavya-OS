export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    process.on("unhandledRejection", (reason, promise) => {
      console.error("[UNHANDLED_REJECTION]", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("[UNCAUGHT_EXCEPTION]", error);
      setTimeout(() => process.exit(1), 1000);
    });
  }
}
