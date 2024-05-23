import React from 'react'
import { AdminEventPlanner, HasPermission } from '../components'

const EventPlanner = () => {
  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mt-7">
        <AdminEventPlanner />
      </div>
    </HasPermission>
  )
}

export default EventPlanner
