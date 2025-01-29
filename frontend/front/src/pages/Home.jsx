import { useState, useEffect } from 'react'
import axios from 'axios'
import AddItemForm from '../components/AddItemForm'
import ItemsList from '../components/ItemsList'
import PairDisplay from '../components/PairDisplay'

const Home = () => {
  const [names, setNames] = useState([])
  const [prizes, setPrizes] = useState([])
  const [pairs, setPairs] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [namesRes, prizesRes] = await Promise.all([
        axios.get('/api/names'),
        axios.get('/api/prizes')
      ])
      setNames(namesRes.data)
      setPrizes(prizesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <AddItemForm type="name" onUpdate={fetchData} />
        <AddItemForm type="prize" onUpdate={fetchData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ItemsList items={names} type="name" onUpdate={fetchData} />
        <ItemsList items={prizes} type="prize" onUpdate={fetchData} />
      </div>
      
      <PairDisplay pairs={pairs} onUpdate={fetchData} />
    </div>
  )
}

export default Home;