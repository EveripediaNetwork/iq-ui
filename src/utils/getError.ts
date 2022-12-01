export const getError = (error: Error | unknown): { error: string } => {
  if (error instanceof Error) return { error: error.message }

  return { error: `Unexpected error, ${error}` }
}
