import React, { useState } from 'react';

// Manually defined time zones ordered by geographical regions
const timeZones = [
  // Default
  {label: "Local Time Zone", value: Intl.DateTimeFormat().resolvedOptions().timeZone},
  {label: "Universal Time Coordinated (UTC) GMT+0", value: "UTC"},
  
  // Americas
  { label: "Hawaii Standard Time (HST) GMT−10", value: "Pacific/Honolulu" },
  { label: "Alaska Standard Time (AKST) GMT−9", value: "America/Anchorage" },
  { label: "Pacific Standard Time (PST) GMT−8", value: "America/Los_Angeles" },
  { label: "Mountain Standard Time (MST) GMT−7", value: "America/Denver" },
  { label: "Central Standard Time (CST) GMT−6", value: "America/Chicago" },
  { label: "Eastern Standard Time (EST) GMT−5", value: "America/New_York" },
  { label: "Brasilia Time (BRT) GMT−3", value: "America/Sao_Paulo" },
  
  // Europe
  { label: "Greenwich Mean Time (GMT) GMT+0", value: "Etc/GMT" },
  { label: "British Summer Time (BST) GMT+1", value: "Europe/London" },
  { label: "Irish Summer Time (IST) GMT+1", value: "Europe/Dublin" },
  { label: "Central European Time (CET) GMT+1", value: "Europe/Berlin" },
  { label: "West Africa Time (WAT) GMT+1", value: "Africa/Lagos" },
  { label: "Eastern European Time (EET) GMT+2", value: "Europe/Athens" },
  { label: "Moscow Standard Time (MSK) GMT+3", value: "Europe/Moscow" },

  // Africa
  { label: "Central Africa Time (CAT) GMT+2", value: "Africa/Harare" },
  { label: "East Africa Time (EAT) GMT+3", value: "Africa/Nairobi" },

  // Asia
  { label: "India Standard Time (IST) GMT+5:30", value: "Asia/Kolkata" },
  { label: "Israel Standard Time (IST) GMT+2", value: "Asia/Jerusalem" },
  { label: "Singapore Time (SGT) GMT+8", value: "Asia/Singapore" },
  { label: "Japan Standard Time (JST) GMT+9", value: "Asia/Tokyo" },

  // Australia
  { label: "Australian Central Standard Time (ACST) GMT+9:30", value: "Australia/Darwin" },
  { label: "Australian Eastern Standard Time (AEST) GMT+10", value: "Australia/Sydney" }
];

const TimeZoneForm = ({ initialTimeZone, onSubmit }) => {
  const [selectedTimeZone, setSelectedTimeZone] = useState(initialTimeZone);

  const handleChange = (e) => {
    setSelectedTimeZone(e.target.value);
    onSubmit(e.target.value);
  };

  return (
    <div>
      <select value={selectedTimeZone} onChange={handleChange}>
        {timeZones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeZoneForm;
