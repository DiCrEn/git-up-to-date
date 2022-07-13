import https from "https";
import { RequestOptions } from "https";

import { changelogData } from "../types";

const WEBHOOK =
  process.env.WEBHOOK ||
  "https://discord.com/api/webhooks/974608679846428712/bnAYrbgCkrQ4Gh-YzYoXPIh0T_HJJruBngz-BQbTa-4dR4L3Uzoo8D2-3WUHAbHhvfkz";
const PROJECT = process.env.PROJECT || "Karonte";

export async function sendChangelogToChannel(changelog: changelogData) {
  if (!WEBHOOK) throw new Error("WEBHOOK is not defined");
  const msg = generateMsg(changelog);
  const msgs = splitMessages(msg);
  const index = 0;
  console.log(msgs);
  for (const msgSplitted of msgs) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Send msg nº ${index} charcount: ${msgSplitted.length}`);
    sendMessage(msgSplitted);
  }
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

function splitMessages(msg: string) {
  const linebreaks = msg.split("\n");
  const allmsgs = [];
  let buildedmsg = "";
  for (const line of linebreaks) {
    if (buildedmsg.length + line.length > 2000) {
      allmsgs.push(buildedmsg);
      buildedmsg = line;
    } else {
      buildedmsg += "\n" + line;
    }
  }
  allmsgs.push(buildedmsg);
  return allmsgs;
}

function sendMessage(message: string) {
  const post_data = JSON.stringify({
    content: message,
    username: "Git up to date",
  });

  const post_options = {
    host: "discord.com",
    port: 443,
    path: WEBHOOK.replace("https://discord.com", ""),
    method: "POST",
    headers: {
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
