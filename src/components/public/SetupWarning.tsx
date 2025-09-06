'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Github, Key, Mail, Database, Zap } from 'lucide-react'
import Link from 'next/link'

export function SetupWarning() {
  const setupSteps = [
    {
      icon: Key,
      title: "Environment Variables",
      description: "Copy .env.example to .env.local and configure all variables",
      status: "required"
    },
    {
      icon: Github,
      title: "GitHub OAuth",
      description: "Create GitHub OAuth app for admin authentication", 
      status: "required"
    },
    {
      icon: Database,
      title: "Vercel Services",
      description: "Set up Vercel KV database and Blob storage",
      status: "required"
    },
    {
      icon: Mail,
      title: "Email Service",
      description: "Configure Resend API for contact form",
      status: "optional"
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full">
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-500 rounded-full">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-yellow-800 dark:text-yellow-200">
              Portfolio Setup Required
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Your portfolio system needs to be configured before you can access the admin panel.
              Follow these steps to get started:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Setup Steps */}
            <div className="grid gap-4 md:grid-cols-2">
              {setupSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <Icon className="w-6 h-6 text-yellow-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {step.title}
                        </h3>
                        <Badge 
                          variant={step.status === 'required' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Start */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Quick Start Guide
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>Copy <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs">.env.example</code> to <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs">.env.local</code></li>
                <li>Configure your GitHub OAuth application</li>
                <li>Set up Vercel KV database and Blob storage</li>
                <li>Add your admin email to the environment variables</li>
                <li>Restart the development server</li>
              </ol>
            </div>

            {/* Documentation Links */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link href="https://github.com/mjremetio/team-landingpage/blob/main/DEPLOYMENT.md">
                  <Github className="w-4 h-4 mr-2" />
                  Setup Documentation
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="https://github.com/mjremetio/team-landingpage/blob/main/README.md">
                  View README
                </Link>
              </Button>
            </div>

            {/* Current Status */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
              <p>
                Once configured, you&apos;ll be able to access the admin panel at{' '}
                <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded text-xs">/admin</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}