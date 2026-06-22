import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { productData } from '@/features/products/productData'
import { blogArticles } from '@/features/blog/blogData'

export default function SEOHead() {
  const { pathname } = useLocation()
  const params = useParams()

  useEffect(() => {
    let title = "KS Resume Builder | Free AI Resume Builder & ATS CV Generator"
    let description = "Build a job-winning, recruiter-approved resume in minutes with KS Resume Builder. ATS-optimized templates, AI generator, scoring checker, cover letters, and interview prep."
    let keywords = "AI resume builder, ATS resume builder, resume maker, CV maker online, free resume builder, cover letter generator, interview preparation AI, LinkedIn optimizer, professional resume templates, MR K AI Ecosystem, Karuppasamy M"
    let canonical = `https://mrk02.vercel.app${pathname}`
    let ogImage = "https://mrk02.vercel.app/og-image.png"
    let schemaMarkup: Record<string, any> | null = null

    // Helper to generate dynamic JSON-LD schemas
    const defaultOrgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MR K AI Ecosystem",
      "alternateName": "MR K AI",
      "url": "https://mrk02.vercel.app",
      "logo": "https://mrk02.vercel.app/logo.png",
      "sameAs": [
        "https://www.linkedin.com/in/karuppasamym",
        "https://github.com/karuppasamym"
      ]
    }

    const defaultPersonSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Karuppasamy M",
      "jobTitle": "Founder & CEO",
      "worksFor": {
        "@type": "Organization",
        "name": "MR K AI Ecosystem"
      },
      "image": "https://mrk02.vercel.app/assets/founder-D5-vKkZf.png",
      "sameAs": [
        "https://www.linkedin.com/in/karuppasamym",
        "https://github.com/karuppasamym"
      ]
    }

    if (pathname === '/') {
      title = "KS Resume Builder | Free AI Resume Builder & ATS CV Generator"
      description = "Build a job-winning resume in minutes with KS Resume Builder. ATS-optimized templates, AI bullet generator, resume score checker, and cover letters. Try the free CV maker."
      schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "KS Resume Builder",
            "operatingSystem": "Web Browser",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1840"
            },
            "featureList": [
              "AI Resume Builder",
              "ATS Resume Checker",
              "Resume Score Checker",
              "Cover Letter AI",
              "Interview Preparation",
              "LinkedIn Optimizer"
            ],
            "publisher": defaultOrgSchema
          },
          defaultOrgSchema,
          defaultPersonSchema
        ]
      }
    } else if (pathname === '/about') {
      title = "About MR K AI Ecosystem | Innovation in Career Optimization"
      description = "Discover the mission, vision, core values, and future AI product roadmap of MR K AI Ecosystem, the company behind the world-class KS Resume Builder platform."
      schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
          defaultOrgSchema,
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About MR K AI Ecosystem",
            "description": "Information about MR K AI Ecosystem and its suite of career optimization tools.",
            "publisher": defaultOrgSchema
          }
        ]
      }
    } else if (pathname.startsWith('/products/')) {
      const slug = params.slug || pathname.split('/').pop() || ''
      const product = productData[slug]
      if (product) {
        title = `${product.title} | KS Resume Builder`
        description = product.description.substring(0, 160)
        keywords = product.keywords.join(', ')
        schemaMarkup = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": product.title,
              "operatingSystem": "Web Browser",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "920"
              },
              "featureList": product.benefits
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": product.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            }
          ]
        }
      }
    } else if (pathname === '/blog') {
      title = "Career Advice, Resume Tips & ATS Guides | KS Resume Builder Blog"
      description = "Browse expert-verified resume formats, software engineer CV guides, MNC recruiter tips, and freshers advice. Read 100+ comprehensive career guides."
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "KS Resume Builder Career Blog",
        "description": "Expert career guidance and resume writing articles.",
        "publisher": defaultOrgSchema
      }
    } else if (pathname.startsWith('/blog/')) {
      const slug = params.slug || pathname.split('/').pop() || ''
      const article = blogArticles[slug]
      if (article) {
        title = `${article.title} | KS Resume Builder Blog`
        description = article.summary.substring(0, 160)
        keywords = article.keywords.join(', ')
        schemaMarkup = {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.summary,
              "image": article.image || "https://mrk02.vercel.app/og-image.png",
              "datePublished": article.publishedAt,
              "dateModified": article.modifiedAt || article.publishedAt,
              "author": {
                "@type": "Person",
                "name": article.author.name,
                "image": article.author.image,
                "jobTitle": article.author.role
              },
              "publisher": defaultOrgSchema,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonical
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": article.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.a
                }
              }))
            }
          ]
        }
      }
    }

    // Set DOM attributes
    document.title = title

    const updateOrCreateMeta = (name: string, value: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attribute, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    updateOrCreateMeta('description', description)
    updateOrCreateMeta('keywords', keywords)
    updateOrCreateMeta('author', 'KS Resume Builder')
    updateOrCreateMeta('og:title', title, true)
    updateOrCreateMeta('og:description', description, true)
    updateOrCreateMeta('og:image', ogImage, true)
    updateOrCreateMeta('og:url', canonical, true)
    updateOrCreateMeta('twitter:title', title)
    updateOrCreateMeta('twitter:description', description)
    updateOrCreateMeta('twitter:image', ogImage)
    updateOrCreateMeta('twitter:url', canonical)

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonical)

    // Inject JSON-LD Schema
    const scriptId = 'json-ld-seo-schema'
    let schemaScript = document.getElementById(scriptId)
    if (schemaScript) {
      schemaScript.remove()
    }
    if (schemaMarkup) {
      schemaScript = document.createElement('script')
      schemaScript.setAttribute('type', 'application/ld+json')
      schemaScript.setAttribute('id', scriptId)
      schemaScript.textContent = JSON.stringify(schemaMarkup)
      document.head.appendChild(schemaScript)
    }

  }, [pathname, params])

  return null
}
