"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationMailTemplate = void 0;
const registrationMailTemplate = (event) => {
    return `
  <mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h1>Registration Successful</h1>
          <p>Thank you for registering for the event "${event.title}".</p>
          <p>Event Details:</p>
          <p>Title: ${event.title}</p>
          <p>Description: ${event.description}</p>
          
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `;
};
exports.registrationMailTemplate = registrationMailTemplate;
