export interface section {
  title?: string;
  text: string;
}

export interface changelogData {
  versionNumber: string;
  sections: {
    [key: string]: section[];
  };
}
