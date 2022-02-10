import React from 'react'
import { Typography } from '@mui/material'

export default function InputField({ title, register }) {
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
          marginLeft: 6,
        }}
      >
        <input
          style={{
            width: '100%',
            border: 'none',
            flex: 1,
            outlineWidth: 0,
            fontWeight: 400,
          }}
          {...register}
        />
      </div>
    </div>
  )
}
