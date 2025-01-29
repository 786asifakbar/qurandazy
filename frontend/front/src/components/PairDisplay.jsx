// frontend/src/components/PairDisplay.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiGift, FiUser } from 'react-icons/fi'

const PairDisplay = ({ onUpdate }) => {
  const [currentPair, setCurrentPair] = useState(null)
  const [remaining, setRemaining] = useState({ names: 0, prizes: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCounts = async () => {
    try {
      const [namesRes, prizesRes] = await Promise.all([
        axios.get('/api/names'),
        axios.get('/api/prizes')
      ])
      setRemaining({
        names: namesRes.data.length,
        prizes: prizesRes.data.length
      })
    } catch (err) {
      setError('Failed to fetch remaining counts')
    }
  }

  const handleDraw = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post('/api/draw')
      setCurrentPair(response.data)
      await fetchCounts()
      onUpdate()
      
      // Auto-clear after 5 seconds
      setTimeout(() => {
        setCurrentPair(null)
      }, 5000)

    } catch (err) {
      setError('Failed to draw pair. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <button
          onClick={handleDraw}
          disabled={loading || remaining.names === 0 || remaining.prizes === 0}
          className={`px-6 py-3 rounded-full text-white font-semibold transition-all
            ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}
            ${remaining.names === 0 || remaining.prizes === 0 ? 'bg-gray-400' : ''}
          `}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <FiRefreshCw className="animate-spin" /> Drawing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FiGift /> Draw Next Pair <FiUser />
            </div>
          )}
        </button>

        <div className="mt-4 text-sm text-gray-600">
          Remaining: {remaining.names} names • {remaining.prizes} prizes
        </div>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}
      </div>

      {currentPair && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiGift className="text-green-500" /> Selected Pair
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={currentPair.name.image} 
                    alt={currentPair.name.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary"
                  />
                  <FiUser className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-primary" />
                </div>
                <h4 className="mt-2 text-lg font-semibold">
                  {currentPair.name.name}
                </h4>
                <p className="text-gray-600">Participant</p>
              </div>

              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={currentPair.prize.image} 
                    alt={currentPair.prize.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-secondary"
                  />
                  <FiGift className="absolute bottom-0 right-0 bg-white p-1 rounded-full text-secondary" />
                </div>
                <h4 className="mt-2 text-lg font-semibold">
                  {currentPair.prize.name}
                </h4>
                <p className="text-gray-600">Prize</p>
              </div>
            </div>

            {/* Progress bar for auto-hide */}
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-5000 ease-linear"
                style={{ width: currentPair ? '0%' : '100%' }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PairDisplay;