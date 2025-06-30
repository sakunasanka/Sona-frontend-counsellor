import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Shield,
  Users,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/ui/Container';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <Container>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 mr-6">
              <img 
                src="/assets/images/Sona-logo.png" 
                alt="Sona Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a>
              <Button 
                variant="primary" 
                onClick={() => navigate('/signin')}
                className="px-6 py-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section 
        className="min-h-screen relative bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(253, 242, 248, 0.8), rgba(255, 255, 255, 0.9), rgba(250, 245, 255, 0.8)), url('https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-6xl font-semi-bold text-gray-900 leading-tight">
                  Wellness starts with a
                </h1>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800">
                    Conversation
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The comprehensive platform designed for counselors and psychiatrists to deliver exceptional patient care,
                  streamline workflows, and improve mental health outcomes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="special" 
                  onClick={() => navigate('/signin')}
                  className="px-8 py-4 text-lg font-semibold transform hover:scale-105 shadow-lg"
                >
                  Join with us
                  <ArrowRight className="inline ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="special" 
                  className="px-8 py-4 text-lg font-semibold"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">Easy Setup</span>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative z-10">
                {/* <div className="w-96 h-96 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/hero-dashboard-preview.webp"
                    alt="Sona Platform Preview"
                    className="w-full h-full object-cover rounded-2xl opacity-80"
                  />
                </div> */}
              </div>
              <div className="absolute -bottom-40 -right-90 w-60 h-60 bg-[#FF978A] rounded-full opacity-90"></div>
              <div className="absolute -bottom-10 -right--30 w-46 h-46 bg-[#A1BEE3] rounded-full opacity-80"></div>
              <div className="absolute -bottom-20 -right--20 w-32 h-32 bg-[#FFE2EA] rounded-full opacity-70"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Active Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">250K+</div>
              <div className="text-gray-600">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Patient Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools counselors and psychiatrists need
              to deliver exceptional mental health care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent appointment scheduling with automated reminders, rescheduling options,
                and seamless calendar integration.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Records</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure, HIPAA-compliant electronic health records with easy note-taking,
                treatment plans, and progress tracking.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive analytics to track patient progress, outcomes, and practice
                performance with actionable insights.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Messaging</h3>
              <p className="text-gray-600 leading-relaxed">
                HIPAA-compliant messaging system for secure communication between
                professionals and patients.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security & Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with end-to-end encryption, audit trails,
                and full HIPAA compliance.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamless collaboration tools for multidisciplinary teams, referrals,
                and care coordination.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built by Mental Health Professionals, for Mental Health Professionals
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sona was created by a team of experienced psychiatrists, counselors, and
                technology experts who understand the unique challenges of mental health practice.
                Our platform is designed to reduce administrative burden while enhancing patient care.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="text-gray-700">Patient-centered design approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">Evidence-based treatment protocols</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-500" />
                  <span className="text-gray-700">Uncompromising security and privacy</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mental health team collaboration"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Mental Health Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience with Sona
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Sona has revolutionized how I manage my practice. The intuitive interface
                and comprehensive features have saved me hours each week."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Dr. Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">Dr. Sarah Johnson</div>
                  <div className="text-gray-600">Clinical Psychologist</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The security features and HIPAA compliance give me complete peace of mind.
                My patients love the seamless appointment scheduling."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Dr. Michael Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">Dr. Michael Chen</div>
                  <div className="text-gray-600">Psychiatrist</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The analytics and reporting features help me track patient progress like never before.
                It's made my practice more effective and data-driven."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Dr. Emily Rodriguez"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">Dr. Emily Rodriguez</div>
                  <div className="text-gray-600">Licensed Counselor</div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-white opacity-90 mb-10 leading-relaxed">
              Join thousands of mental health professionals who have already revolutionized
              their patient care with Sona.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary"
                onClick={() => navigate('/signin')}
                className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-gray-100"
              >
                Start Free 30-Day Trial
              </Button>
              <Button 
                variant="border"
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary"
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="text-white opacity-75 mt-6">
              No credit card required • Full access • Cancel anytime
            </p>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/assets/images/Sona-logo.png" 
                  alt="Sona Logo" 
                  className="h-8 w-auto"
                />
                <span className="text-2xl font-bold">Sona</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering mental health professionals with the tools they need to provide
                exceptional patient care.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" />
                  <span>1-800-SONA-CARE</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" />
                  <span>support@sona.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sona. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">HIPAA Compliance</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;