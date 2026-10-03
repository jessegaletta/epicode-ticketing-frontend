import { Button, Modal } from "react-bootstrap";

function PrivacyPolicyModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="privacy-policy-modal-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="privacy-policy-modal-title">
          Privacy Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Data Collection & Privacy</h4>
        <p>
          Welcome to Epicode Ticketing. As the Students' Representative and sole developer, I am committed to protecting your personal information and your right to privacy. 
          When you use my application, you trust me with your personal data. I take this responsibility very seriously.
        </p>

        <h5>1. Information I Collect</h5>
        <p>
          I collect personal information that you voluntarily provide to me when you register on the application. 
          This information includes your <strong>First Name, Last Name, Email Address, and Avatar URL</strong>.
          I process your information for purposes based on legitimate interests as the Students' Representative, the fulfillment of my responsibilities to you, and compliance with legal obligations.
        </p>

        <h5>2. Storage of Information</h5>
        <p>
          To keep you securely logged into the application, I use the browser's <code>localStorage</code> to store a technical Authentication Token (JWT). 
          This token is strictly necessary for the application to function and provide you with access to your private profile. I do not use cookies or local storage for profiling or marketing purposes.
        </p>

        <h5>3. Third-Party Service Providers</h5>
        <p>
          I use third-party services to operate and improve the application. Specifically, I use <strong>Cloudinary</strong>, a secure cloud-based media management service, to host and serve your user profile avatars. 
          When you upload an avatar, the image file is transferred to and stored on Cloudinary's servers. Cloudinary acts as a Data Processor and is fully compliant with international data protection standards, including the GDPR.
        </p>

        <h5>4. Your Privacy Rights (GDPR)</h5>
        <p>
          Under the General Data Protection Regulation (GDPR) and other international privacy laws, you have the right to access, rectify, or erase your personal data.
          You can exercise your <strong>Right to be Forgotten</strong> at any time. The platform provides a dedicated feature that allows you to permanently delete your account and all associated personal data (including avatars hosted on Cloudinary) from the servers.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PrivacyPolicyModal;
