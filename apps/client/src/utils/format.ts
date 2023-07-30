import { capitalize } from 'lodash'

/**
 * This function is helpful in converting enums from backend to better formatted strings like
 * FORMAT_ENUM -> Format Enum
 */

export function formatEnum(value?: string) {
  return value?.split('_').map(capitalize).join(' ') ?? ''
}
