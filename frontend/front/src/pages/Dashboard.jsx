// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  FiUsers, 
  FiGift, 
  FiActivity, 
  FiPlus,
  FiArchive,
  FiPieChart
} from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalNames: 0,
    totalPrizes: 0,
    totalPairs: 0,
    remainingNames: 0,
    remainingPrizes: 0
  })
  const [recentPairs, setRecentPairs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [namesRes, prizesRes, pairsRes] = await Promise.all([
          axios.get('/api/names'),
          axios.get('/api/prizes'),
          axios.get('/api/pairs')
        ])

        setStats({
          totalNames: namesRes.data.length,
          totalPrizes: prizesRes.data.length,
          totalPairs: pairsRes.data.length,
          remainingNames: namesRes.data.filter(n => !n.used).length,
          remainingPrizes: prizesRes.data.filter(p => !p.used).length
        })

        setRecentPairs(pairsRes.data.slice(-5).reverse())
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <FiPieChart className="text-primary" /> Qurandazi Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard 
          icon={<FiUsers />}
          title="Total Names"
          value={stats.totalNames}
          color="bg-blue-100"
        />
        <StatCard
          icon={<FiGift />}
          title="Total Prizes"
          value={stats.totalPrizes}
          color="bg-green-100"
        />
        <StatCard
          icon={<FiActivity />}
          title="Pairs Generated"
          value={stats.totalPairs}
          color="bg-purple-100"
        />
        <StatCard
          icon={<FiArchive />}
          title="Remaining Names"
          value={stats.remainingNames}
          color="bg-yellow-100"
        />
        <StatCard
          icon={<FiArchive />}
          title="Remaining Prizes"
          value={stats.remainingPrizes}
          color="bg-red-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Pairs Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentPairs}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prize" fill="#3498DB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Pairs</h2>
          <div className="space-y-4">
            {recentPairs.map((pair, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{pair.name.name}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-semibold">{pair.prize.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(pair.pairedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
              <FiPlus className="text-2xl mb-2" />
              Add New Name
            </button>
            <button className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition">
              <FiPlus className="text-2xl mb-2" />
              Add New Prize
            </button>
          </div>
        </div>

        {/* System Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">System Summary</h2>
          <div className="space-y-2">
            <SummaryItem 
              label="Names Remaining"
              value={stats.remainingNames}
              max={stats.totalNames}
              color="bg-blue-200"
            />
            <SummaryItem
              label="Prizes Remaining"
              value={stats.remainingPrizes}
              max={stats.totalPrizes}
              color="bg-green-200"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} p-4 rounded-lg shadow-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-2xl p-2 bg-white rounded-full">{icon}</div>
    </div>
  </div>
)

const SummaryItem = ({ label, value, max, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-semibold">{value}/{max}</span>
      <div className="w-20 h-2 bg-gray-200 rounded-full">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value/max)*100}%` }}
        ></div>
      </div>
    </div>
  </div>
)

export default Dashboard