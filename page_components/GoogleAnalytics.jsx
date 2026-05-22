"use client ";

import Script from "next/Script";

export default function GoogleAnalytics() {
  const GA_MEASURED_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_MEASURED_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASURED_ID}`}
        strategy="afterInteractive"
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
      window.dataLayer = window.dataLayer || [];
 function gtag(){
  dataLayer.push(arguments);
  }
    gtag('js', new Date());
      gtag('config', '${GA_MEASURED_ID}',{
      page_path:
      window.location.pathname,});


    `}
      </Script>
    </>
  );
}
