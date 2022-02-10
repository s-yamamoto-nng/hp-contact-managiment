import React from 'react'
import { Typography } from '@mui/material'

export default function SelectField({ options, title, register }) {
  return (
    <div>
      <Typography variant="body2" color="primary" style={{ margin: 6 }}>
        {title}
      </Typography>
      <div
        style={{
          border: '1px solid lightGray',
          borderRadius: 3,
          display: 'flex',
          padding: 10,
          color: 'gray',
          background: '#fff',
          paddingLeft: 15,
          textAlign: 'center',
          marginLeft: 6,
        }}
      >
        <select
          style={{
            width: '100%',
            paddingRight: '1em',
            cursor: 'pointer',
            textIndent: 0.01,
            textOverflow: 'ellipsis',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            appearance: 'none',
          }}
          {...register}
        >
          {options &&
            options.map(option => (
              <option key={`select_${option.value}`} value={option.value}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}
