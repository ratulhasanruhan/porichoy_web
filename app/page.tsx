"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Globe,
  Download,
  Eye,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useTranslations } from "@/lib/hooks/useTranslations";
import Image from "next/image";

export default function HomePage() {
  const { user } = useAuthStore();
  const { t, locale } = useTranslations({ namespace: 'home' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with smart navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4 animate-pulse">
            {t('hero.badge', '🇧🇩 Made for Bangladesh')}
          </div>

          <h1
            className={`text-5xl lg:text-7xl font-bold tracking-tight ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {t('hero.title1', 'Create Your')}
            <span className="text-primary"> {t('hero.title2', 'Professional')} </span>
            {t('hero.title3', 'Resume')}
          </h1>

          <p
            className={`text-xl text-muted-foreground max-w-2xl mx-auto ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {t('hero.subtitle', 'Build, Customize & Share Your Career Story')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!user ? (
              <>
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t('hero.startBuilding', 'Start Building Free')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    {t('hero.viewTemplates', 'View Templates')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('navigation.dashboard', 'Go to Dashboard')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/edit">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    {t('navigation.createResume', 'Create Resume')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {t('hero.noCreditCard', '✓ No credit card required • ✓ Free forever • ✓ Bangla & English Support')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div
                className={`text-sm text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('stats.users', 'Users')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5000+</div>
              <div
                className={`text-sm text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('stats.resumesCreated', 'Resumes Created')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10+</div>
              <div
                className={`text-sm text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('stats.templates', 'Templates')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-4 ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {locale === "bn" ? "শক্তিশালী ফিচার" : "Powerful Features"}
          </h2>
          <p
            className={`text-muted-foreground max-w-2xl mx-auto ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {locale === "bn"
              ? "আপনার পেশাগত জীবন তৈরির জন্য প্রয়োজনীয় সবকিছু"
              : "Everything you need to build your professional presence"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.easyBuilder.title', 'Easy Resume Builder')}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.easyBuilder.description', 'Create professional resumes with our intuitive editor. No design skills needed.')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.multilingual.title', 'Bangla & English')}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.multilingual.description', 'Full support for both Bangla and English. Create resumes in your preferred language.')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.exportShare.title', 'Export & Share')}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('features.exportShare.description', 'Download as PDF or share your unique portfolio link. Get your own porichoy.me/username.')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn" ? "দ্রুত ও সহজ" : "Fast & Easy"}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn"
                  ? "মাত্র ৫ মিনিটে আপনার রিজিউম তৈরি করুন। রিয়েল-টাইম প্রিভিউ এবং অটো-সেভ।"
                  : "Build your resume in just 5 minutes. Real-time preview and auto-save feature."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn" ? "নিরাপদ ও সুরক্ষিত" : "Safe & Secure"}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn"
                  ? "আপনার ডেটা সম্পূর্ণ সুরক্ষিত। প্রাইভেসি কন্ট্রোল এবং এনক্রিপ্টেড স্টোরেজ।"
                  : "Your data is completely secure. Privacy controls and encrypted storage."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn" ? "ফ্রি ফরএভার" : "Free Forever"}
              </h3>
              <p
                className={`text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {locale === "bn"
                  ? "সব ফিচার সম্পূর্ণ বিনামূল্যে। কোনো লুকানো খরচ নেই। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই।"
                  : "All features completely free. No hidden costs. No credit card required."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-4 ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {locale === "bn" ? "কীভাবে কাজ করে" : "How It Works"}
          </h2>
          <p
            className={`text-muted-foreground max-w-2xl mx-auto ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {locale === "bn"
              ? "মাত্র তিনটি সহজ ধাপে আপনার পেশাদার রিজিউম তৈরি করুন"
              : "Create your professional resume in just three simple steps"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              1
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn" ? "সাইন আপ করুন" : "Sign Up"}
            </h3>
            <p
              className={`text-muted-foreground ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn"
                ? "একটি ফ্রি অ্যাকাউন্ট তৈরি করুন এবং আপনার ইউনিক ইউজারনেম বেছে নিন"
                : "Create a free account and choose your unique username"}
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              2
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn" ? "রিজিউম তৈরি করুন" : "Build Resume"}
            </h3>
            <p
              className={`text-muted-foreground ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn"
                ? "আপনার তথ্য পূরণ করুন এবং একটি টেমপ্লেট বেছে নিন"
                : "Fill in your information and choose a template"}
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
              3
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn" ? "শেয়ার করুন" : "Share"}
            </h3>
            <p
              className={`text-muted-foreground ${
                locale === "bn" ? "font-bengali" : ""
              }`}
            >
              {locale === "bn"
                ? "PDF ডাউনলোড করুন বা আপনার পোর্টফোলিও লিংক শেয়ার করুন"
                : "Download PDF or share your portfolio link"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2
            className={`text-3xl lg:text-4xl font-bold mb-4 ${
              locale === "bn" ? "font-bengali" : ""
            }`}
          >
            {t('cta.title', 'Ready to Build Your Resume?')}
          </h2>
          <p
            className={`text-lg mb-8 opacity-90 ${locale === "bn" ? "font-bengali" : ""}`}
          >
            {t('cta.subtitle', 'Start today - Completely free')}
          </p>
          {!user ? (
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t('cta.button', 'Create Free Account')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 shadow-lg hover:shadow-xl"
              >
                {locale === "bn" ? "ড্যাশবোর্ডে যান" : "Go to Dashboard"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logos/text_logo.png"
                  alt="Porichoy Logo"
                  width={100}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <p
                className={`text-sm text-muted-foreground ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('footer.description', 'Professional resume builder for Bangladeshi people.')}
              </p>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('footer.product', 'Product')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/templates"
                    className="hover:text-primary"
                  >
                    {t('footer.templates', 'Templates')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-primary"
                  >
                    {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('footer.company', 'Company')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary"
                  >
                    {t('footer.about', 'About')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary"
                  >
                    {t('footer.contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  locale === "bn" ? "font-bengali" : ""
                }`}
              >
                {t('footer.legal', 'Legal')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary"
                  >
                    {t('footer.privacy', 'Privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary"
                  >
                    {t('footer.terms', 'Terms')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p className={locale === "bn" ? "font-bengali" : ""}>
              &copy; {new Date().getFullYear()} Porichoy.{" "}
              {t('footer.copyright', 'All rights reserved.')}
              {locale === "bn"
                ? "🇧🇩 বাংলাদেশের জন্য ভালোবাসা দিয়ে তৈরি"
                : "🇧🇩 Made with love for Bangladesh"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
