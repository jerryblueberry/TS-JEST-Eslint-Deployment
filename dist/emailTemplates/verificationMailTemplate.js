"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationMailTemplate = void 0;
const verificationMailTemplate = (otp) => {
    return `
  <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              <h1>Signup Successfull</h1>
              <p>Thank you for registering.</p>
              <p>OTP</p>
              <p>Dont Share with anyone</p>
              <p>${otp}</p>
              
              
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
`;
};
exports.verificationMailTemplate = verificationMailTemplate;
