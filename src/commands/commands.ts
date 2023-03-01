// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global global, Office, console */

import { createGroupConversation, createGroupLink } from "../api/api";
//import { appendToBody, getBody, getSubject } from "../utils/mailbox";

// Office is ready. Init
Office.onReady(function () {
  mailboxItem = Office.context.mailbox.item;
});

const defaultSubjectValue = "New Appointment";
let mailboxItem;

function test() {
  getSubject(mailboxItem, (subject) => {
    createGroupConversation(subject ?? defaultSubjectValue).then((r) => {
      createGroupLink(r).then((r) => {
        const groupLink = `<a href="${r}">${r}</a>`;
        appendToBody(mailboxItem, groupLink);
      });
    });
  });

  // maybe can be done better ?
  // createMeetingLinkElement().then((meetingLink) => {
  //   appendToBody(mailboxItem, meetingLink);
  // });
}

function appendDisclaimerOnSend(event) {
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

// UTILS

// async function createMeetingLinkElement() {
//   return await createGroupConversation("Success-Outlook").then((r) => {
//     createGroupLink(r).then((r) => {
//       return `<a href="${r}">${r}</a>`;
//     });
//   });
// }

/** Returns value of current mailbox item subject, must pass a callback function to receive value */
export async function getSubject(item, callback) {
  const { subject } = item;

  await subject.getAsync(function (asyncResult) {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      console.error("Failed to get item subject");
    } else {
      callback(asyncResult.value);
    }
  });
}

/** Returns value of current mailbox item body, must pass a callback function to receive value*/
export async function getBody(item, callback) {
  const { body } = item;

  await body.getAsync(Office.CoercionType.Html, function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.error("Failed to get HTML body.");
    } else {
      callback(asyncResult.value);
    }
  });
}

export function setBody(item, newBody) {
  const { body } = item;
  const type = { coercionType: Office.CoercionType.Html };

  body.setAsync(newBody, type, function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.error("Failed to set HTML body.", asyncResult.error.message);
    } else {
      // do something else perhaps?
    }
  });
}

export function appendToBody(item, contentToAppend) {
  getBody(item, (currentBody) => {
    setBody(item, currentBody + contentToAppend);
  });
}

// Register the functions.
Office.actions.associate("test", test);
Office.actions.associate("appendDisclaimerOnSend", appendDisclaimerOnSend);
