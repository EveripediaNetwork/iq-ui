import Script from 'next/script'
import React from 'react'
import { useAccount } from 'wagmi'

const GoogleAnalyticsScripts = () => {
  const { address } = useAccount()
  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script strategy="afterInteractive" id="google-analytics-config">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
            ${address && `gtag('set', 'user_id', ${JSON.stringify(address)})`}
          `}
      </Script>
    </>
  )
}

export default GoogleAnalyticsScripts
