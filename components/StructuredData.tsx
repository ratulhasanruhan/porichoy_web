'use client'

import Script from 'next/script'

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Porichoy",
    "alternateName": "পরিচয়",
    "description": "Professional resume builder for Bangladeshi people. Create your resume in Bangla and English.",
    "url": "https://porichoy.me",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Porichoy",
      "url": "https://porichoy.me",
      "logo": {
        "@type": "ImageObject",
        "url": "https://porichoy.me/images/logos/porichoy_with_bg.png",
        "width": 1200,
        "height": 630
      }
    },
    "featureList": [
      "Resume Builder",
      "Portfolio Creator", 
      "Bangla Language Support",
      "English Language Support",
      "PDF Export",
      "Template Library",
      "Free to Use"
    ],
    "screenshot": "https://porichoy.me/images/logos/porichoy_with_bg.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-01",
    "inLanguage": ["bn", "en"],
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": "Bangladesh"
      }
    },
    "keywords": "resume builder, cv maker, portfolio creator, bangla resume, english resume, bangladesh jobs, career development"
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}
