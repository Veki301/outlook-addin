// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global global, fetch, console */

// TODO: should not be hardcoded
const teamIdStaging = "6da5733c-e610-48cf-917c-a8d27ec89d72";
//const teamId = "e1684e2f-39d8-4caf-8e11-0da24a46280b";
////////////////////////////////

const apiUrl = "https://staging-nginz-https.zinfra.io/v2";
const token =
  "t-2mAc5kax9GA-Zhx8NbiMvFfcN8uEaDaViOQ7IdGAMh9BN6rrHPG134uW2CYkPmsP9T-JdjuVsNPnlDOloeAQ==.v=1.k=1.d=1676634583.t=a.l=.u=b8486973-0b59-4dcf-89eb-a362817fcc31.c=17398943149433977354";

export async function createGroupConversation(name: string) {
  const payload = {
    access: ["invite", "code"],
    access_role_v2: ["guest", "non_team_member", "team_member", "service"],
    conversation_role: "wire_member",
    name: name,
    protocol: "proteus",
    qualified_users: [],
    receipt_mode: 1,
    team: {
      managed: false,
      teamid: teamIdStaging,
    },
    users: [],
  };

  // TODO: any/model
  const response: any = await fetch(apiUrl + "/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  return response.id;
}

export async function createGroupLink(conversationId: string) {
  // TODO: any/model
  const response: any = await fetch(apiUrl + `/conversations/${conversationId}/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());

  return response.data.uri;
}
