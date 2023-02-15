// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global global, fetch, console */

// TODO: should not be hardcoded
const teamId = "e1684e2f-39d8-4caf-8e11-0da24a46280b";
////////////////////////////////

const apiUrl = "https://prod-nginz-https.wire.com/v2";
const token =
  "V9pZekTUZjrlasBWdtD97LMmX8g5cFP4fsMiWdfAcR3P7XKvKc3BswcSsMt_SrRcb-oq-PgI7EtZ0ct5l3NaBg==.v=1.k=1.d=1676454684.t=a.l=.u=0a2203f9-b0c2-4dfe-a349-f668dfd1397b.c=18248128201865300892";
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
      teamid: teamId,
    },
    users: [],
  };

  // TODO: any/model
  const response: any = await fetch(apiUrl + "/conversations", {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  console.log(response, response.body);

  return response.id;
}

export async function createGroupLink(conversationId: string) {
  // TODO: any/model
  const response: any = await fetch(apiUrl + `/conversations/${conversationId}/code`, {
    method: "POST",
    //mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response);
  return response.data.uri;
}
