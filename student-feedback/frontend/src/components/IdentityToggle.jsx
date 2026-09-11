import React from 'react'

export const IdentityToggle = ({ showName, showRegisterNo, onShowNameChange, onShowRegisterNoChange }) => (
  <div className="space-y-3">
    <p className="text-sm text-gray-300 uppercase tracking-wide">Identity Visibility</p>
    <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
      <input type="checkbox" id="show_name" checked={showName} onChange={(e) => onShowNameChange(e.target.checked)} />
      <label htmlFor="show_name" className="cursor-pointer flex-1 text-sm">Show my name</label>
    </div>
    <div className="flex items-center gap-3 p-3 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
      <input type="checkbox" id="show_register" checked={showRegisterNo} onChange={(e) => onShowRegisterNoChange(e.target.checked)} />
      <label htmlFor="show_register" className="cursor-pointer flex-1 text-sm">Show my register number</label>
    </div>
  </div>
)
