import https from "https";
import { RequestOptions } from "https";

import { changelogData } from "../types";

const CHANNELID = process.env.CHANNELID;
const TOKEN = process.env.TOKEN;
const PROJECT = process.env.PROJECT || "";

export function sendChangelogToChannel(changelog: changelogData) {
  const msg = generateMsg(changelog);
  sendMessage(msg);
}

function generateMsg(changelog: changelogData) {
  const lines = [
    "‎",
    `:confetti_ball: :confetti_ball: ${PROJECT} version **${changelog.versionNumber}** was released! :confetti_ball: :confetti_ball:`,
  ];

  for (const section in changelog.sections) {
    const sectionData = changelog.sections[section];
    lines.push(
      "",
      `**${getEmojiSection(section)} ${section} ${getEmojiSection(section)}**`
    );
    for (const change of sectionData) {
      if (change.title) {
        lines.push(`► \`${change.title}\`: ${change.text}`);
      } else if (section === "BREAKING CHANGES") {
        lines.push(`${change.text}`);
      } else {
        lines.push(`► ${change.text}`);
      }
    }
  }

  return lines.join("\n");
}

function getEmojiSection(section: string) {
  switch (section) {
    case "Bug Fixes":
      return ":cockroach:";
    case "Features":
      return ":rocket:";
    case "Refactor":
      return ":sparkles:";
    case "BREAKING CHANGES":
      return ":boom:";
    default:
      return ":rainbow:";
  }
}

function sendMessage(message: string) {
  const post_data = JSON.stringify({
    content: message,
  });

  const post_options = {
    host: "discordapp.com",
    port: 443,
    path: `/api/channels/${CHANNELID}/messages`,
    method: "POST",
    headers: {
      Authorization: `Bot ${TOKEN}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(post_data),
    },
  } as RequestOptions;

  // Set up the request
  const post_req = https.request(post_options, function (res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      console.log("Response: " + chunk);
    });
  });

  post_req.on("error", function (data) {
    console.log("Error", data);
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
}
