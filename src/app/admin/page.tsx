import React from 'react'
import { 
  Users, 
  BookOpen, 
  FileText, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const stats = [
  { 
    label: 'Total Students', 
    value: '1,280', 
    change: '+12%', 
    icon: <Users className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50' 
  },
  { 
    label: 'Question Bank', 
    value: '4,520', 
    change: '+5%', 
    icon: <BookOpen className="w-6 h-6 text-orange-600" />,
    bg: 'bg-orange-50' 
  },
  { 
    label: 'Active Mock Tests', 
    value: '18', 
    change: '0%', 
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-50' 
  },
  { 
    label: 'Avg. Pass Rate', 
    value: '72%', 
    change: '+2.4%', 
    icon: <Activity className="w-6 h-6 text-green-600" />,
    bg: 'bg-green-50' 
  },
]

const recentActivity = [
  { id: 1, type: 'signup', user: 'Vikram Gondane', detail: 'New student registered', time: '2 mins ago', icon: <Users className="w-4 h-4" /> },
  { id: 2, type: 'test', user: 'Rahul Sharma', detail: 'Completed Module 3 Mock Test', time: '15 mins ago', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { id: 3, type: 'question', user: 'Admin', detail: 'Added 5 new questions to Module 4', time: '1 hour ago', icon: <BookOpen className="w-4 h-4 text-orange-500" /> },
  { id: 4, type: 'alert', user: 'System', detail: 'High traffic detected on GCAA practice set', time: '2 hours ago', icon: <AlertCircle className="w-4 h-4 text-red-500" /> },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back. Here's what's happening today at Wings Academy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[0.7rem] font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-black text-[#0f172a] mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <button className="text-sm font-bold text-primary hover:text-accent transition-colors">View All</button>
          </div>
          
          <div className="space-y-6 flex-1">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative last:after:hidden after:absolute after:left-[18px] after:top-10 after:bottom-0 after:w-0.5 after:bg-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center relative z-10 shrink-0">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a] leading-tight">{activity.user}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{activity.detail}</p>
                  <p className="text-[0.65rem] font-medium text-slate-400 mt-1 uppercase tracking-tighter">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Placeholder */}
        <div className="lg:col-span-2 bg-primary p-8 rounded-3xl border border-primary-light shadow-2xl relative overflow-hidden flex flex-col justify-center text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <TrendingUp className="w-12 h-12 text-accent mb-6" />
            <h2 className="text-3xl font-black mb-4 leading-tight">Growth & Performance <span className="text-accent underline decoration-4">Analytics</span></h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-lg">
              Detailed tracking of student engagement and test performance. This module will show interactive charts once we have live data.
            </p>
            <div className="mt-10 flex gap-4">
                <button className="bg-accent text-[#0f172a] px-8 py-3 rounded-2xl font-black shadow-xl shadow-accent/20 hover:bg-[#dca500] transition-all">Generate Report</button>
                <button className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-2xl font-black hover:bg-white/20 transition-all">Detailed View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
