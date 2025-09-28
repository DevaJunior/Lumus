import React from 'react';


const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider"></span>
  </label>
);

export default ToggleSwitch;