// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global global, fetch, console */

// TODO: should not be hardcoded
const teamIdStaging = "6da5733c-e610-48cf-917c-a8d27ec89d72";
//const teamId = "e1684e2f-39d8-4caf-8e11-0da24a46280b";
////////////////////////////////

const apiUrl = "https://staging-nginz-https.zinfra.io/v2";
const token =
  "bMvGsd_cPN2h86zNdYsyZKeMvcYmt_buzDuKg36Vyg-Wclql3qgdvRZzkVzZG8Tkw9yN-puW9l6FheCSiXs9Cg==.v=1.k=1.d=1677686158.t=a.l=.u=af00d8c1-2db0-4c9b-9325-8bd6b99ec33f.c=10010104069689456709";

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
