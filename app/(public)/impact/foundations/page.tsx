import Section from '@/components/ui/Section';
import { FoundationCard } from '@/components/impact/FoundationCard';
import Button from '@/components/ui/Button';

export default function FoundationsPage() {
  const foundations = [
    {
      name: 'American Red Cross',
      description: 'The American Red Cross prevents and alleviates human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.',
      website: 'https://www.redcross.org',
    },
    {
      name: "St. Jude Children's Research Hospital",
      description: 'Leading the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.',
      website: 'https://www.stjude.org',
    },
    {
      name: 'American Heart Association',
      description: 'Fighting heart disease and stroke, striving to save and improve lives through research, education, and community programs.',
      website: 'https://www.heart.org',
    },
    {
      name: 'National Alliance on Mental Illness (NAMI)',
      description: "The nation's largest grassroots mental health organization dedicated to building better lives for millions affected by mental illness.",
      website: 'https://www.nami.org',
    },
    {
      name: 'American Cancer Society',
      description: 'Working to free the world from cancer through research, patient support, early detection, treatment, and education.',
      website: 'https://www.cancer.org',
    },
    {
      name: 'Feeding America',
      description: "The nation's largest domestic hunger-relief organization, working to connect people with food and end hunger.",
      website: 'https://www.feedingamerica.org',
    },
    {
      name: 'Boys & Girls Clubs of America',
      description: 'Enabling all young people to reach their full potential as productive, caring, responsible citizens through youth development programs.',
      website: 'https://www.bgca.org',
    },
    {
      name: 'Special Olympics',
      description: 'Providing year-round sports training and athletic competition for children and adults with intellectual disabilities.',
      website: 'https://www.specialolympics.org',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-[#40E0D0] via-[#7FFFD4] to-[#9370DB] py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">🏥</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Foundations We Endorse
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Supporting exceptional organizations working to improve health and wellness worldwide
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Our Commitment to Community Health</h2>
            
            <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
              At AFYA, we believe in the power of collaboration and community. While we focus on making movement accessible to everyone, we recognize that health and wellness extend far beyond fitness. These exceptional organizations are doing vital work in their respective areas, and we're proud to endorse their missions.
            </p>
          </div>

          {/* Foundation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {foundations.map((foundation) => (
              <FoundationCard
                key={foundation.name}
                name={foundation.name}
                description={foundation.description}
                website={foundation.website}
              />
            ))}
          </div>

          {/* Why We Endorse Section */}
          <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Why We Endorse These Organizations</h3>
            <p className="text-gray-700 mb-4">
              Each of these foundations represents excellence in their field and shares our commitment to improving lives. They demonstrate:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Proven Impact:</strong> Track records of making real differences in people's lives</li>
              <li>• <strong>Transparency:</strong> Clear communication about their work and use of resources</li>
              <li>• <strong>Accessibility:</strong> Commitment to serving all communities, regardless of circumstances</li>
              <li>• <strong>Innovation:</strong> Forward-thinking approaches to solving health and wellness challenges</li>
              <li>• <strong>Community Focus:</strong> Recognition that health is built through community support</li>
            </ul>
          </div>

          {/* How to Support Section */}
          <div className="prose prose-lg max-w-none mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">How You Can Support</h3>
            <p className="text-gray-700 mb-6">
              We encourage our community to learn about these organizations and consider supporting their work. Whether through donations, volunteering, or simply spreading awareness, every action helps build a healthier, more supportive world.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 border-2 border-gray-200 rounded-xl">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="font-bold text-gray-900 mb-2">Donate</h4>
                <p className="text-gray-700 text-sm">Financial contributions help these organizations expand their reach and impact.</p>
              </div>
              
              <div className="text-center p-6 border-2 border-gray-200 rounded-xl">
                <div className="text-3xl mb-3">🙋</div>
                <h4 className="font-bold text-gray-900 mb-2">Volunteer</h4>
                <p className="text-gray-700 text-sm">Many organizations need volunteers to support their programs and events.</p>
              </div>
              
              <div className="text-center p-6 border-2 border-gray-200 rounded-xl">
                <div className="text-3xl mb-3">📢</div>
                <h4 className="font-bold text-gray-900 mb-2">Advocate</h4>
                <p className="text-gray-700 text-sm">Share their work with your network and help raise awareness of their missions.</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Important Note:</strong> AFYA is an independent organization. The foundations listed above are not affiliated with AFYA, and we do not receive any financial benefit from endorsing them. We simply recognize their important work in health and wellness and encourage our community to support organizations making a positive impact.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button as="a" href="/impact" variant="primary" size="lg">
              View AFYA's Impact Programs
            </Button>
            <Button as="a" href="/contact" variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
