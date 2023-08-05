const addressRegex = /^0x[a-fA-F0-9]{40}$/

export function checkIsAddress(address: string) {
  return addressRegex.test(address)
}
