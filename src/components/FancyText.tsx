import React, { useMemo } from 'react'
import JoditEditor from 'jodit-react'

const FancyText: React.FC<any> = ({ config, ...props }) => {
  const memoConfig = useMemo(
    () => ({
      ...(config || {}),
      language: 'es'
    }),
    [config]
  )

  return (
    <>
      <JoditEditor
        config={memoConfig}
        {...props}
      />
    </>
  )
}

export default FancyText