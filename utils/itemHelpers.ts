import { ListItem } from '../hooks/useListItems'

export const getStatusColor = (status: ListItem['status']) => {
  switch (status) {
    case 'needed': return '#3B82F6' // Blue-500
    case 'in_cart': return '#F59E0B' // Amber-500  
    case 'bought': return '#10B981' // Emerald-500
    case 'out_of_stock': return '#EF4444' // Red-500
    default: return '#6B7280' // Gray-500
  }
}

export const getStatusBackgroundColor = (status: ListItem['status']) => {
  switch (status) {
    case 'needed': return '#DBEAFE' // Blue-100
    case 'in_cart': return '#FEF3C7' // Amber-100
    case 'bought': return '#D1FAE5' // Emerald-100
    case 'out_of_stock': return '#FEE2E2' // Red-100
    default: return '#F3F4F6' // Gray-100
  }
}

export const getStatusText = (status: ListItem['status']) => {
  switch (status) {
    case 'needed': return 'Need'
    case 'in_cart': return 'In Cart'
    case 'bought': return 'Bought'
    case 'out_of_stock': return 'Out of Stock'
    default: return status
  }
}

export const getStatusIcon = (status: ListItem['status']) => {
  switch (status) {
    case 'needed': return '📋'
    case 'in_cart': return '🛒'
    case 'bought': return '✅'
    case 'out_of_stock': return '❌'
    default: return '📋'
  }
}

export const sortItems = (items: ListItem[]) => {
  return items.sort((a, b) => {
    // Sort bought and out-of-stock items to the bottom
    const aIsInactive = a.status === 'bought' || a.status === 'out_of_stock'
    const bIsInactive = b.status === 'bought' || b.status === 'out_of_stock'
    
    if (aIsInactive && !bIsInactive) return 1
    if (!aIsInactive && bIsInactive) return -1
    
    // For items with the same active/inactive status, maintain original order (by created_at)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
} 