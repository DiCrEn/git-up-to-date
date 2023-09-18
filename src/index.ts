import fs from "fs";

import { getLastChangelogData } from "./lib/parseChangelogFile";
import { sendChangelogToChannel } from "./lib/sendChangelogMsg";

const CHANGELOGPATH = process.env.CHANGELOGPATH || "CHANGELOG.md";
const RECEIVER = process.env.RECEIVER || "SLACK";


const changelogString = fs
  .readFileSync(CHANGELOGPATH, "utf8")
  .toString() as string;

const changelogData = getLastChangelogData(changelogString);
sendChangelogToChannel(changelogData, RECEIVER);
