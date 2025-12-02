import { listData } from '@/lib/dummyData'
import React from 'react'
import ListCard from '../properties/list-card'

const List = () => {
    const list = listData
  return (
    <div className="grid grid-cols-1 gap-8">
    {list.map((item) => (
      <ListCard key={item.id} item={item} />
    ))}
  </div>
  )
}

export default List