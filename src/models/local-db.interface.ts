interface SuccessfullyCreatedJob {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  projectName: string;
  projectId: string;
}

export type SuccessfullyCreatedJobsDb = Record<string, SuccessfullyCreatedJob>;
