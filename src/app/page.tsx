'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const HomePage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/dashboards')
  }, [router])
  return <></>
}

export default HomePage
