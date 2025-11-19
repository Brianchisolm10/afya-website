export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-lg text-white drop-shadow-md">
            Last Updated: November 18, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gradient-to-b from-white to-afya-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 prose prose-lg max-w-none
            prose-headings:text-gray-900 
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-afya-primary/30
            prose-h3:text-xl prose-h3:font-semibold prose-h3:text-afya-secondary prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-ul:space-y-2
            prose-li:text-gray-700
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-a:text-afya-primary prose-a:no-underline hover:prose-a:text-afya-primary-dark">
          <h2>Introduction</h2>
          <p>
            AFYA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name, email address, phone number, and mailing address</li>
            <li>Date of birth and demographic information</li>
            <li>Health and fitness information (goals, medical history, dietary preferences)</li>
            <li>Emergency contact information</li>
            <li>Payment and billing information</li>
            <li>Account credentials (username and password)</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you access our website, we automatically collect:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and manage your account</li>
            <li>Develop personalized wellness packets and fitness plans</li>
            <li>Communicate with you about your account and services</li>
            <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
            <li>Process payments and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Analyze usage patterns and improve user experience</li>
          </ul>

          <h2>HIPAA Compliance</h2>
          <p>
            AFYA takes the protection of your health information seriously. We comply with the Health Insurance Portability and Accountability Act (HIPAA) and implement appropriate safeguards to protect your Protected Health Information (PHI).
          </p>
          <ul>
            <li>All health information is encrypted in transit and at rest</li>
            <li>Access to PHI is restricted to authorized personnel only</li>
            <li>We maintain comprehensive audit logs of all access to health information</li>
            <li>We conduct regular security assessments and training</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          
          <h3>Service Providers</h3>
          <p>
            We may share information with third-party service providers who perform services on our behalf, such as payment processing, email delivery, and hosting services. These providers are contractually obligated to protect your information.
          </p>

          <h3>Healthcare Providers</h3>
          <p>
            With your explicit consent, we may share relevant health information with your healthcare providers to coordinate your care.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose information if required by law, court order, or governmental request, or to protect our rights, property, or safety.
          </p>

          <h2>Data Security</h2>
          <p>We implement industry-standard security measures to protect your information:</p>
          <ul>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Bcrypt password hashing with high cost factors</li>
            <li>Secure session management with httpOnly cookies</li>
            <li>Regular security audits and penetration testing</li>
            <li>Rate limiting to prevent brute force attacks</li>
            <li>Comprehensive audit logging</li>
          </ul>

          <h2>Your Rights and Choices</h2>
          
          <h3>Access and Update</h3>
          <p>
            You can access and update your personal information through your account settings or by contacting us.
          </p>

          <h3>Data Portability</h3>
          <p>
            You have the right to request a copy of your personal information in a structured, machine-readable format.
          </p>

          <h3>Deletion</h3>
          <p>
            You may request deletion of your account and personal information. Note that we may retain certain information as required by law or for legitimate business purposes.
          </p>

          <h3>Marketing Communications</h3>
          <p>
            You can opt out of marketing emails by clicking the "unsubscribe" link in any marketing email or by updating your preferences in your account settings.
          </p>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Health information is retained for a minimum of 7 years as required by law.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> afya@theafya.org</li>
            <li><strong>Address:</strong> Maryland, United States</li>
          </ul>

          <h2>Your California Privacy Rights</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to deletion of personal information</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>

          <h2>GDPR Rights (European Users)</h2>
          <p>
            If you are in the European Economic Area, you have rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>

          <div className="bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 p-8 rounded-xl mt-12 border-2 border-afya-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Questions or Concerns?</h3>
            <p className="mb-6 text-gray-700">
              We're committed to protecting your privacy and addressing any concerns you may have.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-afya-primary text-white rounded-lg hover:bg-afya-primary-dark transition-colors font-semibold shadow-lg"
            >
              Contact Us
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
