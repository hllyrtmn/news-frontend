import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private router = inject(Router);
  
  private defaultTitle = environment.appName;
  private defaultDescription = 'En güncel haberler, son dakika gelişmeleri ve özel röportajlar';
  private defaultImage = '/assets/images/og-default.jpg';

  constructor() {
    // Update canonical URL on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCanonicalUrl();
      });
  }

  // Update all meta tags
  updateTags(data: SeoData): void {
    // Update title
    const title = data.title ? `${data.title} | ${this.defaultTitle}` : this.defaultTitle;
    this.titleService.setTitle(title);

    // Update basic meta tags
    this.updateTag('description', data.description || this.defaultDescription);
    if (data.keywords) {
      this.updateTag('keywords', data.keywords);
    }

    // Update Open Graph tags
    this.updateTag('og:title', data.title || this.defaultTitle, 'property');
    this.updateTag('og:description', data.description || this.defaultDescription, 'property');
    this.updateTag('og:image', data.image || this.defaultImage, 'property');
    this.updateTag('og:url', data.url || this.getCurrentUrl(), 'property');
    this.updateTag('og:type', data.type || 'website', 'property');
    this.updateTag('og:site_name', this.defaultTitle, 'property');

    // Update Twitter Card tags
    this.updateTag('twitter:card', 'summary_large_image');
    this.updateTag('twitter:title', data.title || this.defaultTitle);
    this.updateTag('twitter:description', data.description || this.defaultDescription);
    this.updateTag('twitter:image', data.image || this.defaultImage);

    // Article specific tags
    if (data.type === 'article') {
      if (data.author) {
        this.updateTag('article:author', data.author, 'property');
      }
      if (data.publishedTime) {
        this.updateTag('article:published_time', data.publishedTime, 'property');
      }
      if (data.modifiedTime) {
        this.updateTag('article:modified_time', data.modifiedTime, 'property');
      }
      if (data.section) {
        this.updateTag('article:section', data.section, 'property');
      }
      if (data.tags && data.tags.length > 0) {
        // Remove existing article:tag tags
        this.meta.removeTag('property="article:tag"');
        // Add new tags
        data.tags.forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    }

    // Update canonical URL
    this.updateCanonicalUrl(data.url);
  }

  // Update single meta tag
  private updateTag(name: string, content: string, attribute: string = 'name'): void {
    if (content) {
      this.meta.updateTag({ [attribute]: name, content });
    }
  }

  // Update canonical URL
  private updateCanonicalUrl(url?: string): void {
    const canonicalUrl = url || this.getCurrentUrl();
    
    // Remove existing canonical link
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  // Get current URL
  private getCurrentUrl(): string {
    return window.location.href;
  }

  // Reset to default tags
  resetTags(): void {
    this.updateTags({
      title: this.defaultTitle,
      description: this.defaultDescription,
      image: this.defaultImage,
      type: 'website'
    });
  }

  // Generate structured data (JSON-LD)
  generateArticleStructuredData(article: any): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title,
      'description': article.summary,
      'image': article.featured_image?.file || this.defaultImage,
      'datePublished': article.published_at,
      'dateModified': article.updated_at,
      'author': {
        '@type': 'Person',
        'name': article.author?.display_name || 'Unknown'
      },
      'publisher': {
        '@type': 'Organization',
        'name': this.defaultTitle,
        'logo': {
          '@type': 'ImageObject',
          'url': '/assets/images/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': this.getCurrentUrl()
      }
    };

    this.addStructuredData(structuredData);
  }

  // Add structured data to page
  private addStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(items: { name: string; url: string }[]): void {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }));

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': itemListElement
    };

    this.addStructuredData(structuredData);
  }
}
