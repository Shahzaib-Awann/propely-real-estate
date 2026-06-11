import ListCard from '../properties/list-card'
import { auth } from '@/auth'
import { getSavedPropertiesByUserId } from '@/lib/actions/properties.action'
import ListClient from '../properties/list-client'

const List = async () => {
  const session = await auth()

  const savedList = await getSavedPropertiesByUserId(Number(session?.user?.id))

  return (
    <div className="grid grid-cols-1 gap-8">

    <ListClient list={savedList} refreshList={true} />

  </div>
  )
}

export default List