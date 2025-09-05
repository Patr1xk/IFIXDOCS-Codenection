import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, CheckCircle, Users, Shield, Zap, Search, FileText, BarChart3, Globe, HelpCircle, Languages } from "lucide-react";

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color="white" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>iFAST Docs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Language Selector */}
              <div style={{ position: 'relative' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                }}>
                  <Globe size={16} />
                  <span>🇺🇸 EN</span>
                </button>
              </div>
              <Link
                to="/app"
                onClick={() => {
                  sessionStorage.setItem('fromLanding', 'true');
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: '800', 
            color: '#111827', 
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            We're <span style={{ color: '#2563eb' }}>documentation</span><br />
            & <span style={{ color: '#2563eb' }}>automation</span> experts
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', 
            color: '#6b7280', 
            maxWidth: '800px', 
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Outdated documentation costs time, slows down onboarding, and frustrates teams. That's why we built a smarter way. Our platform helps you write less, read faster, and always keep your docs up-to-date. Never gets stuck in the past!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <Link
              to="/app"
              onClick={() => {
                sessionStorage.setItem('fromLanding', 'true');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '18px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              border: '2px solid #d1d5db',
              backgroundColor: 'transparent',
              color: '#374151',
              padding: '16px 32px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.color = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.color = '#374151';
            }}>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '64px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '32px', 
            textAlign: 'center' 
          }}>
            {[
              { number: '1,247+', label: 'Documents Managed' },
              { number: '24', label: 'Team Members' },
              { number: '98%', label: 'Document Health' },
              { number: '3+', label: 'Years Experience' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>
                  {stat.number}
                </div>
                <div style={{ color: '#6b7280', fontSize: '16px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '24px' 
            }}>
              Our Documentation Solutions
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Your vision, our support: together we turn documentation into a driver of digital transformation and lasting success
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {[
              {
                icon: <BookOpen size={32} color="#2563eb" />,
                title: 'Simplify Writing',
                description: 'Auto-generate docs from code, use smart templates, and get real-time assistance. Make documentation creation effortless and efficient.',
                features: ['GitHub integration', 'AI-powered templates', 'PDF export'],
                color: '#eff6ff'
              },
              {
                icon: <Zap size={32} color="#059669" />,
                title: 'Speed Up Reading',
                description: 'AI-powered search, summarization, and intelligent Q&A for faster comprehension. Find what you need in seconds, not minutes.',
                features: ['Smart search', 'AI summarization', 'Q&A assistant'],
                color: '#ecfdf5'
              },
              {
                icon: <Shield size={32} color="#d97706" />,
                title: 'Easy Maintenance',
                description: 'Detect stale docs, get change notifications, and auto-suggest updates. Keep your documentation always current and reliable.',
                features: ['Stale detection', 'Auto-updates', 'Health monitoring'],
                color: '#fffbeb'
              },
              {
                icon: <Globe size={32} color="#7c3aed" />,
                title: 'Multilingual Support',
                description: 'Create and manage documentation in multiple languages. Support global teams with localized content and automatic translations.',
                features: ['Multi-language docs', 'Auto-translation', 'Localization tools'],
                color: '#f3f4f6'
              },
              {
                icon: <HelpCircle size={32} color="#dc2626" />,
                title: 'Smart Onboarding',
                description: 'Welcome new team members with interactive tutorials, guided tours, and contextual help. Get them productive faster.',
                features: ['Interactive tutorials', 'Guided tours', 'Contextual help'],
                color: '#fef2f2'
              },
              {
                icon: <BarChart3 size={32} color="#0891b2" />,
                title: 'Analytics & Insights',
                description: 'Track documentation usage, identify knowledge gaps, and measure team productivity with detailed analytics.',
                features: ['Usage analytics', 'Knowledge gaps', 'Productivity metrics'],
                color: '#f0f9ff'
              }
            ].map((service, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 20px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: service.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '16px' 
                }}>
                  {service.title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  {service.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <CheckCircle size={20} color="#059669" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '24px' 
            }}>
              Speak Your Team's Language
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Break down language barriers and support global teams with our comprehensive multilingual documentation platform
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            {[
              { code: 'en', name: 'English', flag: '🇺🇸', desc: 'Primary language with full feature support' },
              { code: 'zh', name: '中文', flag: '🇨🇳', desc: 'Complete Chinese localization' },
              { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', desc: 'Malay language support' },
              { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', desc: 'Tamil documentation support' },
              { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', desc: 'Hindi language support' },
              { code: 'es', name: 'Español', flag: '🇪🇸', desc: 'Spanish documentation' }
            ].map((lang, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer',
                backgroundColor: '#ffffff'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{lang.flag}</div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>
                  {lang.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>{lang.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '24px' 
            }}>
              Get Your Team Up to Speed in Minutes
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Transform new team members into documentation experts with our intelligent onboarding system
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {[
              {
                icon: <HelpCircle size={32} color="#dc2626" />,
                title: 'Interactive Tutorials',
                description: 'Step-by-step guided tours that walk users through every feature. Learn by doing with hands-on exercises.',
                color: '#fef2f2'
              },
              {
                icon: <Users size={32} color="#059669" />,
                title: 'Team Onboarding',
                description: 'Welcome new members with personalized introductions, role-based training, and progress tracking.',
                color: '#ecfdf5'
              },
              {
                icon: <BookOpen size={32} color="#2563eb" />,
                title: 'Knowledge Base',
                description: 'Comprehensive help center with searchable articles, video guides, and best practices.',
                color: '#eff6ff'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 20px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: feature.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '16px' 
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '24px' 
            }}>
              We serve teams across all industries
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              From startups to enterprise, our documentation solutions adapt to your needs
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px' 
          }}>
            {[
              { name: 'Medium Enterprise', desc: 'Scale documentation with your growing team' },
              { name: 'Large Enterprise', desc: 'Enterprise-grade security and compliance' },
              { name: 'Education', desc: 'Academic documentation and research support' },
              { name: 'Government', desc: 'Secure documentation for public sector' }
            ].map((industry, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '24px',
                borderRadius: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Users size={32} color="#2563eb" />
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '8px' 
                }}>
                  {industry.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#2563eb' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: '700', 
            color: '#ffffff', 
            marginBottom: '24px' 
          }}>
            Ready to transform your documentation?
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#bfdbfe', 
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Join thousands of teams who have already improved their documentation workflow 
            with iFAST's intelligent solutions.
          </p>
          <Link
            to="/app"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#ffffff',
              color: '#2563eb',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            <span>Start Free Trial</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: '#ffffff', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#2563eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BookOpen size={20} color="white" />
                </div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>iFAST Docs</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
                Smarter, faster, and more maintainable documentation for the real world.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Solutions</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>Write Docs</li>
                <li style={{ marginBottom: '8px' }}>Read & Search</li>
                <li style={{ marginBottom: '8px' }}>Maintenance</li>
                <li style={{ marginBottom: '8px' }}>Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>About Us</li>
                <li style={{ marginBottom: '8px' }}>Careers</li>
                <li style={{ marginBottom: '8px' }}>Contact</li>
                <li style={{ marginBottom: '8px' }}>Support</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px' }}>Connect</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af', fontSize: '14px' }}>
                <li style={{ marginBottom: '8px' }}>LinkedIn</li>
                <li style={{ marginBottom: '8px' }}>Twitter</li>
                <li style={{ marginBottom: '8px' }}>GitHub</li>
                <li style={{ marginBottom: '8px' }}>Blog</li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #374151', 
            paddingTop: '32px', 
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            <p>&copy; 2025 iFAST Documentation Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
