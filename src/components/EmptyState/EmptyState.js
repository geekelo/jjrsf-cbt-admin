import React from 'react'
import '../../Stylesheets/EmptyState.css'
export default function EmptyState({message}) {
  return (
    <div className="empty-state">
    <p>{message}</p>
  </div>
  )
}
