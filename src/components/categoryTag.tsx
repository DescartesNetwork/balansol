import { useCallback, useEffect } from 'react'

import { Tag } from 'antd'

import { CATEGORY } from 'constant'

type CategoryTagProps = {
  category: keyof typeof CATEGORY
}

const CategoryTag = ({ category }: CategoryTagProps) => {
  const categoryColor = useCallback(
    (opacity?: string) => {
      const color = CATEGORY[category]
      if (opacity) return `rgba(${color[0]},${color[1]},${color[2]},${opacity})`
      return `rgba(${color[0]},${color[1]},${color[2]},1)`
    },
    [category],
  )
  useEffect(() => {
    categoryColor()
  }, [categoryColor])
  return (
    <Tag style={{ color: categoryColor() }} color={categoryColor('0.1')}>
      {category}
    </Tag>
  )
}

export default CategoryTag
