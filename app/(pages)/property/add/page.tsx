import PropertyForm from '@/components/pages/property/property-form'
import React from 'react'

const CreatePropertyPage = () => {
  return (
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">
      <PropertyForm mode='create' />
    </main>
  )
}

export default CreatePropertyPage