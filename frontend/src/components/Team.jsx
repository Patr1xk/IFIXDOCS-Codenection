import { useState } from 'react';
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const Team = () => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['ceo', 'cto', 'cpo', 'cfo']));

  const teamData = {
    ceo: {
      id: 'ceo',
      name: 'Sarah Chen',
      title: 'Chief Executive Officer',
      department: 'Executive',
      email: 'sarah.chen@ifastdocs.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'SC',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      reports: ['cto', 'cpo', 'cfo', 'chro']
    },
    cto: {
      id: 'cto',
      name: 'Michael Rodriguez',
      title: 'Chief Technology Officer',
      department: 'Engineering',
      email: 'michael.rodriguez@ifastdocs.com',
      phone: '+1 (555) 123-4568',
      location: 'San Francisco, CA',
      avatar: 'MR',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      reports: ['eng-manager', 'dev-manager', 'qa-manager', 'devops-manager']
    },
    cpo: {
      id: 'cpo',
      name: 'Lisa Wang',
      title: 'Chief Product Officer',
      department: 'Product',
      email: 'lisa.wang@ifastdocs.com',
      phone: '+1 (555) 123-4569',
      location: 'San Francisco, CA',
      avatar: 'LW',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      reports: ['pm-manager', 'design-manager', 'research-manager']
    },
    cfo: {
      id: 'cfo',
      name: 'David Kim',
      title: 'Chief Financial Officer',
      department: 'Finance',
      email: 'david.kim@ifastdocs.com',
      phone: '+1 (555) 123-4570',
      location: 'San Francisco, CA',
      avatar: 'DK',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      reports: ['finance-manager', 'accounting-manager']
    },
    chro: {
      id: 'chro',
      name: 'Jennifer Smith',
      title: 'Chief Human Resources Officer',
      department: 'Human Resources',
      email: 'jennifer.smith@ifastdocs.com',
      phone: '+1 (555) 123-4571',
      location: 'San Francisco, CA',
      avatar: 'JS',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      reports: ['hr-manager', 'recruiting-manager']
    },
    engManager: {
      id: 'eng-manager',
      name: 'Alex Johnson',
      title: 'Engineering Manager',
      department: 'Engineering',
      email: 'alex.johnson@ifastdocs.com',
      phone: '+1 (555) 123-4572',
      location: 'San Francisco, CA',
      avatar: 'AJ',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      reports: ['senior-dev-1', 'senior-dev-2', 'mid-dev-1', 'mid-dev-2']
    },
    devManager: {
      id: 'dev-manager',
      name: 'Rachel Green',
      title: 'Development Manager',
      department: 'Engineering',
      email: 'rachel.green@ifastdocs.com',
      phone: '+1 (555) 123-4573',
      location: 'San Francisco, CA',
      avatar: 'RG',
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      reports: ['frontend-dev-1', 'frontend-dev-2', 'backend-dev-1', 'backend-dev-2']
    },
    qaManager: {
      id: 'qa-manager',
      name: 'Tom Wilson',
      title: 'QA Manager',
      department: 'Engineering',
      email: 'tom.wilson@ifastdocs.com',
      phone: '+1 (555) 123-4574',
      location: 'San Francisco, CA',
      avatar: 'TW',
      color: 'bg-gradient-to-br from-teal-500 to-teal-600',
      reports: ['qa-engineer-1', 'qa-engineer-2', 'automation-engineer']
    },
    devopsManager: {
      id: 'devops-manager',
      name: 'Priya Patel',
      title: 'DevOps Manager',
      department: 'Engineering',
      email: 'priya.patel@ifastdocs.com',
      phone: '+1 (555) 123-4575',
      location: 'San Francisco, CA',
      avatar: 'PP',
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      reports: ['devops-engineer-1', 'devops-engineer-2', 'site-reliability-engineer']
    },
    pmManager: {
      id: 'pm-manager',
      name: 'Chris Lee',
      title: 'Product Manager',
      department: 'Product',
      email: 'chris.lee@ifastdocs.com',
      phone: '+1 (555) 123-4576',
      location: 'San Francisco, CA',
      avatar: 'CL',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      reports: ['product-owner-1', 'product-owner-2', 'business-analyst']
    },
    designManager: {
      id: 'design-manager',
      name: 'Emma Davis',
      title: 'Design Manager',
      department: 'Product',
      email: 'emma.davis@ifastdocs.com',
      phone: '+1 (555) 123-4577',
      location: 'San Francisco, CA',
      avatar: 'ED',
      color: 'bg-gradient-to-br from-rose-500 to-rose-600',
      reports: ['ui-designer-1', 'ui-designer-2', 'ux-researcher']
    },
    researchManager: {
      id: 'research-manager',
      name: 'Kevin Brown',
      title: 'Research Manager',
      department: 'Product',
      email: 'kevin.brown@ifastdocs.com',
      phone: '+1 (555) 123-4578',
      location: 'San Francisco, CA',
      avatar: 'KB',
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      reports: ['user-researcher', 'data-analyst', 'market-researcher']
    },
    financeManager: {
      id: 'finance-manager',
      name: 'Maria Garcia',
      title: 'Finance Manager',
      department: 'Finance',
      email: 'maria.garcia@ifastdocs.com',
      phone: '+1 (555) 123-4579',
      location: 'San Francisco, CA',
      avatar: 'MG',
      color: 'bg-gradient-to-br from-lime-500 to-lime-600',
      reports: ['financial-analyst-1', 'financial-analyst-2']
    },
    accountingManager: {
      id: 'accounting-manager',
      name: 'James Taylor',
      title: 'Accounting Manager',
      department: 'Finance',
      email: 'james.taylor@ifastdocs.com',
      phone: '+1 (555) 123-4580',
      location: 'San Francisco, CA',
      avatar: 'JT',
      color: 'bg-gradient-to-br from-sky-500 to-sky-600',
      reports: ['accountant-1', 'accountant-2', 'payroll-specialist']
    },
    hrManager: {
      id: 'hr-manager',
      name: 'Amanda White',
      title: 'HR Manager',
      department: 'Human Resources',
      email: 'amanda.white@ifastdocs.com',
      phone: '+1 (555) 123-4581',
      location: 'San Francisco, CA',
      avatar: 'AW',
      color: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600',
      reports: ['hr-specialist-1', 'hr-specialist-2', 'benefits-coordinator']
    },
    recruitingManager: {
      id: 'recruiting-manager',
      name: 'Ryan Miller',
      title: 'Recruiting Manager',
      department: 'Human Resources',
      email: 'ryan.miller@ifastdocs.com',
      phone: '+1 (555) 123-4582',
      location: 'San Francisco, CA',
      avatar: 'RM',
      color: 'bg-gradient-to-br from-slate-500 to-slate-600',
      reports: ['recruiter-1', 'recruiter-2', 'talent-acquisition-specialist']
    }
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderEmployeeCard = (employee) => {
    const isExpanded = expandedNodes.has(employee.id);
    const hasReports = employee.reports && employee.reports.length > 0;

    return (
      <div key={employee.id} className="flex flex-col items-center">
        {/* Employee Card */}
        <div className="relative group">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 w-64 hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer">
            {/* Avatar */}
            <div className={`w-16 h-16 ${employee.color} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
              {employee.avatar}
            </div>
            
            {/* Employee Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{employee.name}</h3>
              <p className="text-sm font-medium text-gray-600 mb-1">{employee.title}</p>
              <p className="text-xs text-gray-500">{employee.department}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{employee.location}</span>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            {hasReports && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(employee.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
          </div>

          {/* Connection Line */}
          {hasReports && (
            <div className="w-0.5 h-8 bg-gray-300 mx-auto"></div>
          )}
        </div>

        {/* Reports */}
        {isExpanded && hasReports && (
          <div className="mt-8 flex gap-8">
            {employee.reports.map((reportId, index) => {
              const report = teamData[reportId];
              if (!report) return null;
              
              return (
                <div key={reportId} className="flex flex-col items-center">
                  {/* Connection Line */}
                  {index > 0 && (
                    <div className="absolute w-8 h-0.5 bg-gray-300 -left-4 top-1/2 transform -translate-y-1/2"></div>
                  )}
                  {renderEmployeeCard(report)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet the talented individuals who make iFAST Docs possible. Our diverse team brings together expertise from across the industry to deliver exceptional documentation solutions.
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">24</h3>
          <p className="text-gray-600">Team Members</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">6</h3>
          <p className="text-gray-600">Departments</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
          <p className="text-gray-600">Locations</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">5</h3>
          <p className="text-gray-600">Leadership</p>
        </div>
      </div>

      {/* Organization Chart */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Organization Chart</h2>
        
        <div className="flex justify-center">
          <div className="relative">
            {renderEmployeeCard(teamData.ceo)}
          </div>
        </div>
      </div>

      {/* Team Culture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Innovation:</strong> We constantly push boundaries to create better documentation solutions</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Collaboration:</strong> We believe great ideas come from working together</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Excellence:</strong> We strive for quality in everything we do</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span><strong>Growth:</strong> We support continuous learning and development</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Join Our Team</h3>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals who share our passion for innovation and excellence. 
            Check out our current openings and become part of our mission to transform documentation.
          </p>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
            <span>View Open Positions</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team; 