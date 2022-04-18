import fs from "fs";

import { getLastChangelogData } from "./lib/parseChangelogFile";
import { sendChangelogToChannel } from "./lib/sendChangelogMsg";

const CHANGELOGPATH = process.env.CHANGELOGPATH || "CHANGELOG.md";

const changelogString = fs
  .readFileSync(CHANGELOGPATH, "utf8")
  .toString() as string;

const changelogData = getLastChangelogData(changelogString);

sendChangelogToChannel(changelogData);
