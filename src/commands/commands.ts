// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global global, Office, console */

//import { createGroupConversation, createGroupLink } from "../api/api";

// Office is ready. Init
Office.onReady(function () {
  mailboxItem = Office.context.mailbox.item;
});

// 1. How to construct online meeting details.
// Not shown: How to get the meeting organizer's ID and other details from your service.
const newBody = "<br/><p>Wire<p>";

let mailboxItem;

// 2. How to define and register a function command named `insertContosoMeeting` (referenced in the manifest)
//    to update the meeting body with the online meeting details.
function insertContosoMeeting(event) {
  // Get HTML body from the client.
  mailboxItem.body.getAsync("html", { asyncContext: event }, function (getBodyResult) {
    if (getBodyResult.status === Office.AsyncResultStatus.Succeeded) {
      updateBody(getBodyResult.asyncContext, getBodyResult.value);
    } else {
      console.error("Failed to get HTML body.");
      getBodyResult.asyncContext.completed({ allowEvent: false });
    }
  });
}

// 3. How to implement a supporting function `updateBody`
//    that appends the online meeting details to the current body of the meeting.
function updateBody(event, existingBody) {
  // Append new body to the existing body.
  mailboxItem.body.setAsync(
    existingBody + newBody,
    { asyncContext: event, coercionType: "html" },
    function (setBodyResult) {
      if (setBodyResult.status === Office.AsyncResultStatus.Succeeded) {
        setBodyResult.asyncContext.completed({ allowEvent: true });
      } else {
        console.error("Failed to set HTML body.");
        setBodyResult.asyncContext.completed({ allowEvent: false });
      }
    }
  );
}

async function appendDisclaimerOnSend(event) {
  // Calls the getTypeAsync method and passes its returned value to the options.coercionType parameter of the appendOnSendAsync call.
  mailboxItem.body.getTypeAsync(
    {
      asyncContext: event,
    },
    (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        console.log(asyncResult.error.message);
        return;
      }

      // Sets the disclaimer to be appended to the body of the message on send.
      const bodyFormat = asyncResult.value;
      let meetingLink = "<p>Testing wire addin</p>";

      mailboxItem.body.appendOnSendAsync(
        meetingLink,
        {
          asyncContext: asyncResult.asyncContext,
          coercionType: bodyFormat,
        },

        async (asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            console.log(asyncResult.error.message);
            return;
          }

          asyncResult.asyncContext.completed();
        }
      );
    }
  );
}

// WIP
// async function createMeetingLinkElement() {
//   return await createGroupConversation("Success-Outlook").then((r) => {
//     createGroupLink(r).then((r) => {
//       return `<a href="${r}">${r}</a>`;
//     });
//   });
// }

// Register the functions.
Office.actions.associate("insertContosoMeeting", insertContosoMeeting);
Office.actions.associate("appendDisclaimerOnSend", appendDisclaimerOnSend);
