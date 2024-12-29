const cleanUpOldJobs = async (agenda, jobName, keyField) => {
    try {
      // Validate inputs
      if (!jobName || !keyField) {
        throw new Error(`Invalid parameters: jobName=${jobName}, keyField=${keyField}`);
      }
  
      // Cancel old jobs
      const result = await agenda.cancel({
        name: jobName,
        [`data.${keyField}`]: { $exists: true },
        nextRunAt: { $lte: new Date() }, // Only jobs scheduled in the past
      });
  
      console.log(`Cleaned up ${result} old jobs for ${jobName}`);
    } catch (err) {
      console.error(`Error cleaning up old jobs for ${jobName || "unknown job"}:`, err);
    }
  };
  
  export default cleanUpOldJobs;
  