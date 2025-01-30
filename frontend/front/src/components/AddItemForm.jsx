import { useState } from 'react'
import axios from 'axios'
import { FiUploadCloud } from 'react-icons/fi'

const AddItemForm = ({ type = 'item', onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.image) {
      console.error('Name and image are required')
      return
    }

    const data = new FormData()
    data.append('name', formData.name)
    data.append('image', formData.image)

    try {
      await axios.post(`/api/${type}s`, data)
      setFormData({ name: '', image: null }) // Reset form after submission
      onUpdate()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Add New {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder={`${type} Name`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <label className="block mb-4">
          <span className="sr-only">Choose image</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <FiUploadCloud /> Add {type}
        </button>
      </form>
    </div>
  )
}

export default AddItemForm
