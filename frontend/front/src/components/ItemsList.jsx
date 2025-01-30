
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'

const ItemsList = ({ items = [], type, onUpdate }) => {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/${type}s/${id}`)
      onUpdate()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Ensure items is an array
  if (!Array.isArray(items)) {
    console.error('Invalid items data:', items)
    return <p className="text-red-500">Error: Invalid items list.</p>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {type.charAt(0).toUpperCase() + type.slice(1)} List
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-3">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">{item.name}</span>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ItemsList
