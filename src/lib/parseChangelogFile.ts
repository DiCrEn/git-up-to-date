import { changelogData, section } from "../types";

export function getLastChangelogData(changelog: string) {
  const allLines = getLastChanges(changelog);

  const changelogData = {
    versionNumber: extractVersionNumber(allLines.shift() as string),
    sections: extractSections(allLines),
  } as changelogData;

  return changelogData;
}

function getPosition(string: string, subString: string, index: number) {
  return string.split(subString, index).join(subString).length;
}

function getLastChanges(fullChangelog: string) {
  const lastVersionPosition = getPosition(fullChangelog, "# [", 1);
  const secondLastVersionPosition = getPosition(fullChangelog, "# [", 2);

  const lastChanges = fullChangelog.substring(
    lastVersionPosition,
    secondLastVersionPosition - 1
  );

  const allLines = lastChanges.split("\n").filter((l) => l !== "");
  return allLines;
}

function extractSections(allLines: readonly string[]) {
  const sections = {};
  let actualSection = null;
  for (const line of allLines) {
    const section = getSectionIfIsSection(line);
    if (section) {
      actualSection = section;
      // @ts-expect-error structure object
      sections[actualSection] = [] as section[];
    } else if (actualSection === "BREAKING CHANGES") {
      // @ts-expect-error structure object
      sections[actualSection].push({ text: line } as section);
    } else if (actualSection) {
      // @ts-expect-error structure object
      sections[actualSection].push(parseChangeLine(line));
    }
  }
  return sections;
}

function getSectionIfIsSection(line: string) {
  const regex = /### (.*)/gm;
  const match = regex.exec(line);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function parseChangeLine(line: string): section {
  const regexCommitId = /(\(\[.{7,8}\]\()/gm;
  const indexOfCommitId = line.search(regexCommitId);
  const relevantText = line.substring(2, indexOfCommitId).trim();

  const regexTitle = /(\*\*.*\*\*)(.*)/gm;
  const match = regexTitle.exec(relevantText);
  if (match) {
    let title = match[1].split("*").filter(Boolean).join("*");
    if (title.endsWith(":")) {
      title = title.slice(0, -1);
    }
    return {
      title,
      text: treatmentLineText(match[2]),
    };
  } else {
    return { text: treatmentLineText(relevantText) };
  }
}

function treatmentLineText(text: string) {
  let treatedLine = text.trim();
  // fix wrong @things
  const regexAtLinks = /.*(\[@.*\])(\(http.*\))/gm;
  const match = regexAtLinks.exec(treatedLine);
  if (match) {
    const eventInfo = match[1];
    const wrongWeb = match[2];
    treatedLine = treatedLine
      .replace(eventInfo, `\`${eventInfo.replace("[", "").replace("]", "")}\``)
      .replace(wrongWeb, "");
  }

  return treatedLine;
}

function extractVersionNumber(titleLine: string) {
  const regex = /.*\[(.*)\].*/gm;
  const match = regex.exec(titleLine);
  return match?.[1];
}
