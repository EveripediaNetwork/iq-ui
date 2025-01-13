import StakePage from '@/components/client/StakePage'
import { getTranslations } from 'next-intl/server'
export const generateMetadata = async () => {
  const t = await getTranslations('hiiq.stake.metadata')

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('description'),
    },
  }
}

const Page = () => {
  return <StakePage />
}

export default Page
