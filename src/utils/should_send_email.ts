// Assuming the timestamp is managed outside this function in a broader scope
export const shouldSendEmail = (lastEmailTimestamp: Date | null): boolean => {
  const now = new Date();
  if (
    lastEmailTimestamp === null ||
    now.getTime() - lastEmailTimestamp.getTime() > 3600000
  ) {
    // Check if more than 3600000 milliseconds (1 hour) have passed
    return true;
  }
  return false;
};
